import os
import random

from flask import Flask, flash, request, redirect, send_file, render_template
from werkzeug.utils import secure_filename
from flask import send_from_directory

from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import HTMLConverter, TextConverter, XMLConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage

from pdf2image import convert_from_path

import PyPDF2

from create_zip import *


UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0


########################################################################################################################
# Crop
########################################################################################################################


@app.route('/crop/download/<filename>', methods=['GET', 'POST'])
def return_files_crop(filename):
    file_path = './crop/'+filename
    return send_file(file_path, as_attachment=True, attachment_filename='', cache_timeout=0)


@app.route('/crop/upload/preview/<filename>', methods=['GET', 'POST'])
def return_preview_img(filename):
    print(filename)
    file_path = './crop/'+filename
    return send_file(file_path, as_attachment=True, attachment_filename='', cache_timeout=0)


uploadCropFile = []


@app.route('/crop/upload/change', methods=['GET', 'POST'])
def crop():
    crop = request.json
    width = crop['width']
    height = crop['height']
    x = crop['x']
    y = crop['y']
    reader = PyPDF2.PdfFileReader('./uploads/'+uploadCropFile[0], 'rb')
    page = reader.getPage(0)
    print(page.cropBox.getLowerLeft())
    print(page.cropBox.getUpperLeft())
    print(page.cropBox.getUpperRight())
    print(page.cropBox.getLowerRight())
    cropFilename = "crop-"+str(random.randint(100000, 900000)) + ".pdf"
    writer = PyPDF2.PdfFileWriter()
    for i in range(reader.getNumPages()):
        page = reader.getPage(i)
        if width != 0:
            page.cropBox.setLowerLeft((x, y))
        if height != 0:
            page.cropBox.setUpperRight(
                (int(width), int(height)))
        writer.addPage(page)
    outstream = open('./crop/'+cropFilename, 'wb')
    writer.write(outstream)
    outstream.close()
    return cropFilename


@app.route('/crop/upload', methods=['POST'])
def crop_preview():
    if request.method == 'POST':
        fname = ''
        file = request.files.get('file')
        if file:
            filename = secure_filename(file.filename)
            uploadCropFile.append(filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            images = convert_from_path('./uploads/' + filename)
            for i, image in enumerate(images):
                if i == 0:
                    fname = "image" + \
                        str(random.randint(100000, 900000)) + ".png"
                    fullfname = './crop/'+fname
                    image.save(fullfname, "PNG")
                    return fname
                else:
                    break
                return ""
    return ""
########################################################################################################################
########################################################################################################################
########################################################################################################################


########################################################################################################################
# Convert
########################################################################################################################

@app.route('/convert/download/<filename>', methods=['GET', 'POST'])
def return_files_convert(filename):
    file_path = './zip/'+filename
    return send_file(file_path, as_attachment=True, attachment_filename='', cache_timeout=0)


def convert_func(case, fname, pages=None):
    if not pages:
        pagenums = set()
    else:
        pagenums = set(pages)
    manager = PDFResourceManager()
    codec = 'utf-8'
    caching = True

    if case == 'text':
        output = io.StringIO()
        converter = TextConverter(
            manager, output, codec=codec, laparams=LAParams())
    if case == 'HTML':
        output = io.BytesIO()
        converter = HTMLConverter(
            manager, output, codec=codec, laparams=LAParams())

    interpreter = PDFPageInterpreter(manager, converter)
    infile = open(fname, 'rb')

    for page in PDFPage.get_pages(infile, pagenums, caching=caching, check_extractable=True):
        interpreter.process_page(page)

    convertedPDF = output.getvalue()
    infile.close()
    converter.close()
    output.close()
    return convertedPDF


def Pdf2html(pdf):
    convertedPDF = convert_func('HTML', './uploads/'+pdf)
    fileConverted = open('./pdf2html/change_html.html', "wb")
    fileConverted.write(convertedPDF)
    fileConverted.close()


def Pdf2txt(pdf):
    convertedPDF = convert('text', './uploads/'+pdf)
    fileConverted = open('./pdf2txt/text.txt', "w")
    fileConverted.write(convertedPDF)
    fileConverted.close()


def Pdf2Png(pdf):
    images = convert_from_path('./uploads/' + pdf)
    for i, image in enumerate(images):
        fname = "./pdf2png/image" + str(i) + ".png"
        image.save(fname, "PNG")


def Pdf2Jpg(pdf):
    images = convert_from_path('./uploads/' + pdf)
    for i, image in enumerate(images):
        fname = "./pdf2jpg/image" + str(i) + ".jpg"
        image.save(fname, "JPEG")


@app.route('/convert/upload', methods=['POST'])
def convert():
    if request.method == 'POST':
        file = request.files.get('file')
        typeToConvert = request.form.get('pdfconverttype')
        # typeToConvert = 'pdf2jpg'
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        if str(typeToConvert) == 'pdf2jpg':
            Pdf2Jpg(filename)
            create_zip('pdf2jpg')
            zipfilename = 'pdf2jpg.zip'
            return zipfilename

        if str(typeToConvert) == 'pdf2png':
            Pdf2Png(filename)
            create_zip('pdf2png')
            zipfilename = 'pdf2png.zip'
            return zipfilename

        if str(typeToConvert) == 'pdf2txt':
            Pdf2txt(filename)
            create_zip('pdf2txt')
            zipfilename = 'pdf2txt.zip'
            return zipfilename

        if str(typeToConvert) == 'pdf2html':
            Pdf2html(filename)
            create_zip('pdf2html')
            zipfilename = 'pdf2html.zip'
            return zipfilename
    return ""


########################################################################################################################
########################################################################################################################
########################################################################################################################


########################################################################################################################
# Merge
########################################################################################################################
pdfarr = []


@app.route('/merge/download/<filename>', methods=['GET', 'POST'])
def return_files_merge(filename):
    file_path = './merged/'+filename
    return send_file(file_path, as_attachment=True, attachment_filename='', cache_timeout=0)


@app.route('/merge/combine', methods=['GET', 'POST'])
def PDFmerge():
    merger = PyPDF2.PdfFileMerger()
    for pdf in pdfarr:
        merger.append(pdf)

    merge_file_name = 'merge' + \
        str(random.randint(100000, 900000))+'.pdf'
    merger.write("merged/"+merge_file_name)
    merger.close()
    pdfarr.clear()
    return merge_file_name


@app.route('/merge/upload', methods=['POST'])
def merge():
    if request.method == 'POST':
        file = request.files.get('file')
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        pdfarr.append('./uploads/'+filename)
        return ""

########################################################################################################################
########################################################################################################################
########################################################################################################################


########################################################################################################################
# Split
########################################################################################################################


@app.route('/split/download/<filename>', methods=['GET', 'POST'])
def return_files_split(filename):
    file_path = './split/'+filename
    return send_file(file_path, as_attachment=True, attachment_filename='', cache_timeout=0)


@app.route('/split/upload', methods=['POST'])
def split():
    if request.method == 'POST':
        file = request.files.get('file')
        from_page = request.form.get('from')
        to_page = request.form.get('to')
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        pdfFileObj = open('./uploads/'+filename, 'rb')

        # creating pdf reader object
        pdfReader = PyPDF2.PdfFileReader(pdfFileObj)

        # starting index of first slice
        start = 0

        # starting index of last slice
        end = int(from_page)-1

        for i in range(3):
            # creating pdf writer object for (i+1)th split
            pdfWriter = PyPDF2.PdfFileWriter()

            # output pdf file name
            outputpdf = filename.split('.pdf')[0] + str(i) + '.pdf'

            # adding pages to pdf writer object
            for page in range(start, end):
                pdfWriter.addPage(pdfReader.getPage(page))

            # writing split pdf pages to pdf file
            with open('./split/'+outputpdf, "wb") as f:
                pdfWriter.write(f)

            # interchanging page split start position for next split
            start = end
            try:
                # setting split end position for next split
                end = int(to_page)+1
            except IndexError:
                # setting split end position for last split
                end = pdfReader.numPages

        # closing the input pdf file object
        pdfFileObj.close()
        return filename.split('.pdf')[0] + '1.pdf'


########################################################################################################################
########################################################################################################################
########################################################################################################################


########################################################################################################################
# Rotate
########################################################################################################################

@app.route('/rotate/download/<filename>', methods=['GET', 'POST'])
def return_files_rotate(filename):
    file_path = './rotated/'+filename
    return send_file(file_path, as_attachment=True, attachment_filename='', cache_timeout=0)


@app.route('/rotate/upload', methods=['POST'])
def rotate():
    if request.method == 'POST':
        file = request.files.get('file')
        degree = request.form.get('degree')
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        pdfFileObj = open('./uploads/'+filename, 'rb')
        pdfReader = PyPDF2.PdfFileReader(pdfFileObj)
        # Write file obj for new file
        pdfWriter = PyPDF2.PdfFileWriter()
        # Applying in all pages
        for page in range(pdfReader.numPages):
            pageObj = pdfReader.getPage(page)
            pageObj.rotateClockwise(int(degree))
            pdfWriter.addPage(pageObj)
        # Store changed file in rotate
        rotatedFilename = filename.split('.pdf')[0] + '-' + \
            str(random.randint(100000, 900000))+'.pdf'
        newFile = open('./rotated/' + rotatedFilename, 'wb')

        pdfWriter.write(newFile)
        pdfFileObj.close()
        newFile.close()

        return rotatedFilename


########################################################################################################################
########################################################################################################################
########################################################################################################################


if __name__ == "__main__":
    app.run(debug=True)
