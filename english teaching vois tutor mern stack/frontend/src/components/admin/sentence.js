import react, { useEffect } from 'react';
import { useState } from 'react';
import { Container, Grid, Box, Typography, Button, TextField, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import FileBase64 from 'react-file-base64';
import { IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Avatar } from '@mui/material';
import MicRecorder from 'mic-recorder-to-mp3'
import { Modal } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const AddSentence = () => {

    const [mp3Recorder, setMp3Recorder] = useState(new MicRecorder({ bitRate: 128 }))
    const [cls, setCls] = useState("")
    const [curSentence, setCurSentence] = useState("")
    const [curChapter, setCurChapter] = useState("")
    const [curChapterName, setCurChapterName] = useState("")
    const [curAudio, setCurAudio] = useState("")
    const [recordModal, setRecordModal] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [voisTutorId, setVoisTutorId] = useState("");

    const handleRecord = () => {
        setRecordModal(true)
    }

    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 1500,
        color: 'black',
        background: '#38CC77',

    })

    const RecordAudio = async () => {
        setIsRecording(true)
        mp3Recorder.start()
            .then(() => {
                setIsRecording(true)
            })
            .catch(e => {
                console.log(e)
            })
    }

    const StopRecording = async (i) => {
        setRecordModal(false)
        Swal.fire({
            title: "Please Wait",
            text: "Uploading Recording",
            backdrop: "true",
            position: "center",
            allowOutsideClick: false,
        })
        Swal.showLoading()
        /* await new Promise(r => setTimeout(r, 2000)); */
        mp3Recorder
            .stop()
            .getMp3()
            .then(([buffer, blob]) => {
                console.log(blob)
                var reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    var base64data = reader.result;
                    setCurAudio(base64data)
                    setIsRecording(false)
                }
                Swal.close()
                Toast.fire({
                    icon: 'success',
                    title: 'Recorded Successfully'
                })
                /* reader.onloadend = function () {
                    var base64data = reader.result;
                    console.log(base64data);
                    axios.post("http://localhost:4000/teacher/addExpertAudio", {
                        sentence: curSentence,
                        blob: base64data
                    })
                        .then(res =>
                            console.log(res)
                        )
                } */

            })
            .catch(e => console.log(e))

    }

    const handleSubmit = () => {

        axios.post("http://localhost:4000/teacher/add", {
            sentence: curSentence,
            cls: cls,
            chapter: curChapter,
            title: curChapterName,
            expertAudio: curAudio,
            vois_tutor_id: voisTutorId,
        }).then(res => {
            Swal.fire({
                icon: 'success',
                title: 'Successfully Added'
            })
            setCurSentence("")
            console.log("Successfully added")
            console.log(res)
        })
        .catch(err => {
            console.log(err)
            Swal.fire({
                icon: 'error',
                title: 'Could not add Sentence'
            })
        })

    }
    return (
        <>
            <Container maxWidth="false" sx={{ width: "90%", padding: "2%" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} display='flex' alignItems='center' justifyContent='center'>
                        <Typography
                            variant="h2"
                            color="secondary"
                            
                        >
                            Add Sentence
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <hr />
                    </Grid>
                    <Grid item xs={12} md={2} display="flex" alignItems="center">
                        <Typography
                            fontSize="1.5rem"
                            required
                            align="left"
                        >
                            Sentence:
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography
                            align="left"
                        >
                            <TextField
                                label="Sentence"
                                fullWidth
                                multiline
                                maxRows={3}
                                value={curSentence}
                                onChange={(event) => { setCurSentence(event.target.value) }}
                            />
                        </Typography>
                    </Grid>
                    <Grid item xs={4} />
                    <Grid item xs={12} md={2} display="flex" alignItems="center">
                        <Typography
                            fontSize="1.5rem"
                            required
                            align="left"
                        >
                            Chapter:
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography
                            align="left"
                        >
                            <TextField
                                label="Chapter"
                                fullWidth
                                value={curChapter}
                                onChange={(event) => { setCurChapter(event.target.value) }}
                            />
                        </Typography>
                    </Grid>
                    <Grid item xs={4} />
                    <Grid item xs={12} md={2} display="flex" alignItems="center">
                        <Typography
                            fontSize="1.5rem"
                            required
                            align="left"
                        >
                            Chapter Name:
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography
                            align="left"
                        >
                            <TextField
                                label="Chapter Name"
                                fullWidth
                                value={curChapterName}
                                onChange={(event) => { setCurChapterName(event.target.value) }}
                            />
                        </Typography>
                    </Grid>
                    <Grid item xs={4} />
                    <Grid item xs={12} md={2} display="flex" alignItems="center">
                        <Typography
                            fontSize="1.5rem"
                            required
                            align="left"
                        >
                            Class:
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography
                            align="left"
                        >
                            <TextField
                                label="Class"
                                fullWidth
                                value={cls}
                                onChange={(event) => { setCls(event.target.value) }}
                            />
                        </Typography>
                    </Grid>
                    <Grid item xs={4} />
                    <Grid item xs={12} md={2} display="flex" alignItems="center">
                        <Typography
                            fontSize="1.5rem"
                            required
                            align="left"
                        >
                            Vois Tutor ID:
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography
                            align="left"
                        >
                            <TextField
                                label="Vois Tutor ID"
                                fullWidth
                                value={voisTutorId}
                                onChange={(event) => { setVoisTutorId(event.target.value) }}
                            />
                        </Typography>
                    </Grid>
                    <Grid item xs={4} />
                    <Grid item xs={12} md={2} display="flex" alignItems="center">
                        <Typography
                            fontSize="1.5rem"
                            required
                            align="left"
                        >
                            Expert Audio:
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography
                            align="left"
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={3}>
                                <FileBase64
                                            type="file"
                                            multiple={false}
                                            onDone={({ base64 }) => { setCurAudio(base64); console.log(base64); }}
                                />
                                </Grid>
                                <Grid item xs={12} md={1}>
                                    OR
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Button
                                        variant="contained"
                                        onClick={handleRecord}
                                    >
                                        <MicIcon />
                                        Record
                                    </Button>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <Typography
                                        align="left"
                                    >
                                        {curAudio != "" ? <> <audio src={curAudio} controls /> </> : null}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Typography>
                    </Grid>
                    <br />
                    <br />
                    <Grid item xs={12} md={8}>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#5BDC77FF'
                            }}
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
                <Modal
                    open={recordModal}
                    onClose={() => { setRecordModal(false) }}
                >
                    <Box sx={style} style={{
                        width: "80%",
                        maxHeight: "70vh",
                        overflowY: "scroll"
                    }}>
                        <Grid container rowSpacing={4}>
                            <Grid item xs={12}>
                                <Typography align="center" variant="h4" sx={{ mt: 2 }}>
                                    {curSentence}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography
                                    align="center"
                                >
                                    {!isRecording ?
                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={RecordAudio}
                                        >
                                            Start Recording
                                        </Button>
                                        :
                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={StopRecording}
                                        >
                                            <MicIcon />
                                            Stop Recording
                                        </Button>
                                    }
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>
            </Container>
        </>
    )

}

export default AddSentence