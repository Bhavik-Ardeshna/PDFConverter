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

from create_zip import *
import PyPDF2


UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0


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
