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
        <>
            <div className="backImg leading-normal text-indigo-400  bg-cover bg-fixed">
                <div className="h-screen">
                    <Navbar />
                    <div className="w-full">

                        <Fragment>
                            <div className="container pt-24 md:pt-36 mx-auto flex-row flex-wrap flex-col md:flex-row items-center">

                                <h1 className="my-4 text-3xl md:text-5xl text-white opacity-75 font-bold leading-tight text-center md:text-left">

                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-100 via-pink-400 to-purple-700">
                                        Convert
                                    </span>

                                </h1>
                                <form method="POST">

                                    <div className="container">

                                        <div {...getRootProps({ style })}>
                                            <input {...getInputProps()} />
                                            <p className="my-4 text-3xl md:text-2xl mr-3 text-white opacity-75 font-bold leading-tight text-center md:text-left">Drag and drop some files here</p>
                                            <div className='uploadbutton'>
                                                <button className="bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-3 px-8 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                                                    type="submit" onClick={onSubmit}>
                                                    upload
                                                </button>
                                            </div>
                                        </div>
                                        <aside>
                                            <ul>{filesdata}</ul>
                                        </aside>
                                    </div >

                                    <div className="pt-10 pl-3 ">
                                        <div className="input-group mt-3 mb-3">
                                            <label className="my-4 text-3xl md:text-2xl mr-3 text-white opacity-75 font-bold leading-tight text-center md:text-left" for="inputGroupSelect01">Convert To :{" "}</label>
                                            <select className="form-select shadow appearance-none border w-max rounded mr-6 p-3 text-gray-700 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                                                name="convertFunc" onChange={convertType} id="convertpdftype">
                                                <option selected>Choose the formate to convert...</option>
                                                <option value="pdf2jpg">Jpeg</option>
                                                <option value="pdf2png">Png</option>
                                                <option value="pdf2txt">Txt</option>
                                                <option value="pdf2html">Html</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button className="bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-3 px-8 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                                        type="submit" onClick={onSubmit}>
                                        Convert
                                    </button>
                                </form>
                                <div className="my-12">

                                    {returnFile ? (

                                        <button className="bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-3 px-8 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                                            type="submit" onClick={downloadFile}>
                                            Download
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        </Fragment>
                    </div>
                </div>
            </div>
        </>
    )
}
