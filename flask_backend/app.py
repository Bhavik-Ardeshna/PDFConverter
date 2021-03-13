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
