import axios from 'axios';
import React, { useMemo, Fragment, useState } from 'react'

import { useDropzone } from 'react-dropzone';

import fileDownload from 'js-file-download';

import { Navbar } from '../Components/Navbar';


const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '70px',
    borderWidth: 5,
    borderRadius: 5,
    borderColor: '#000',
    borderStyle: 'double',
    backgroundColor: '#2845FF',
    color: 'white',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    width: '700px'
};

const activeStyle = {
    borderColor: '#2845FF'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

export const Convert = () => {

    const [pdfconvertType, setPdfConvertType] = useState('');
    const [returnFile, setReturnFile] = useState('');
    const [UploadedFile, setUploadedFile] = useState({});


    const convertType = e => {
        setPdfConvertType(e.target.value)
    }

    const addFile = async (ind, file) => {
        const formData = new FormData();

        formData.append('file', file);
        formData.append('pdfconverttype', document.getElementById('convertpdftype').value);
        try {
            const res = await axios.post('/convert/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(res => {
                    setReturnFile(res.data);
                    console.log(returnFile)
                });
            const { fileName, filePath } = res.data;
            setUploadedFile({ fileName, filePath });
            console.log(returnFile)
        } catch (err) {
            console.log('Error in file upload');
        }
    }
    const onSubmit = async e => {
        e.preventDefault();
        console.log(acceptedFiles)
        for (let i = 0; i < 2; i++) {
            console.log(acceptedFiles[i])
            addFile(i, acceptedFiles[i])
        }
    }

    const downloadFile = e => {
        axios.get('/convert/download/' + returnFile, {
            responseType: 'blob',
        }).then(res => {
            console.log(res.data)
            let rName = returnFile;
            fileDownload(res.data, rName);
        });
    }


    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        acceptedFiles,
        open
    } = useDropzone({ accept: '.pdf', noClick: true, noKeyboard: true });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    const filesdata = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size / 1e+6} MB
        </li>
    ));

    return (
        <div>

        </div>
    )
}
