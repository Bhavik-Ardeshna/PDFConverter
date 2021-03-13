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
    backgroundColor: '#208AF4',
    color: 'white',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    width: '700px'
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};
export const Crop = () => {

    const [previewImg, setPreviewImg] = useState('');
    const [returnPreviewImg, setReturnPreviewImg] = useState('');
    const [crop, setCrop] = useState({
        aspect: 16 / 9,
    });
    const [flag, setFlag] = useState(false);
    const [returnFile, setReturnFile] = useState('');
    const [UploadedFile, setUploadedFile] = useState({});


    const addFile = async (ind, file) => {
        const formData = new FormData();

        formData.append('file', file);
        try {
            const res = await axios.post('/crop/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(res => {
                    setReturnPreviewImg(res.data);
                    console.log(returnPreviewImg)
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
        axios.get('/crop/download/' + returnFile, {
            responseType: 'blob',
        }).then(res => {
            console.log(res.data)
            let rName = returnFile;
            fileDownload(res.data, rName);
        });
    }


    const cropp = async (ind, filen) => {
        try {
            const res = await axios.post('/crop/upload/change', crop, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    setReturnFile(res.data);
                    console.log(returnFile)
                })

        } catch (err) {
            console.log('Error in file upload');
        }

    }

    const doCrop = e => {
        e.preventDefault();
        console.log(acceptedFiles)
        for (let i = 0; i < 2; i++) {
            console.log(acceptedFiles[i])
            cropp(i, acceptedFiles[i])
        }
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
