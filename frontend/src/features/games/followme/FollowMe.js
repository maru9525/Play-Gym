import React, {useEffect, useState} from 'react'
import styles from '../Games.module.css'
import Header from '../gameHeader'
import LeftGameScreen from './LeftGameScreen'
import RightGameScreen from './RightGameScreen'
import Grid from '@mui/material/Grid';
import { Route, Link, NavLink } from 'react-router-dom';
import GameStartCount from '../gameStartCount'
import { useDispatch, useSelector } from 'react-redux';
import { requestRandomGameByAge } from '../../../app/actions/userActions'
import mimicBGM from '../../../images/나처럼해봐요.mp3'
import f_text from '../../../images/followMe/f_text.png'

export function FollowMe(props) {
  const BGM = new Audio(mimicBGM)

  const dispatch = useDispatch()
  const [dummyProgressData, setDummyProgressData] = useState(30)
  const [seconds, setSeconds] = useState(0)
  const [openStartCount, setOpenStartCount] = useState(false)
  const [exerciseList, setExerciseList] = useState([])
  
  useEffect(() => {
    BGM.play()
      .catch(() => {
        console.log('not played')
      })

    return () => BGM.pause()
  }, [])

  useEffect(() => {
    const params = {
      ageStep: 1,
      count: 2,
    }
    dispatch(requestRandomGameByAge(params))
      .then(res => {
        // res.payload.data.result === response
        // res.payload.status

        // setExerciseList(res.payload.data.result.Game.map(game => game.id))
        setExerciseList(res.payload.data.result.Game.map(game => game.name))
      })
      .catch(err => {
        // err.response.status: 400
        console.dir(err)
      })
  }, [])

  useEffect(() => {
    console.log('state updated')
  }, [exerciseList])

  useEffect(() => {
    console.log('second changed')
    const interval = setInterval(() => {
      if (seconds > 0) {
        console.log('tick tock')
        setSeconds(c => c - 1);
        // setSeconds(seconds => seconds - 1); // same code
      }
      else {
        console.log('times up!')
        clearInterval(interval)
        setOpenStartCount(false)
      }
    }, 1000)
    // returned function => for clean up (leaving)
    return () => clearInterval(interval)
  }, [seconds])

  const endGame = () => {
    props.history.push('/home')
  }

  return(
    <div className={styles.container}>
      {/* {seconds} */}

      <Header progress={dummyProgressData} onEndgameClick={endGame} />
      {/* <button onClick={() => {setSeconds(3); setOpenStartCount(true);}}>set 3sec timer</button> */}
      <Grid 
        container 
        // direction="column" 
        justifyContent="center" 
        alignItems="center"
        // sx={{width: '100%', height: '100%'}}
      >
        <Grid item md={12} mt={'50px'}>
          <img src={f_text} width={'250px'}/>
        </Grid>
        <Grid item md={4} mt={'5%'}>
          <LeftGameScreen />
        </Grid>
        <Grid item md={1} mt={'5%'}></Grid>
        <Grid item md={4} mt={'5%'}>
          <RightGameScreen />
        </Grid>
      </Grid>
      {/* send progress data as props to Header */}
      {/* <img src={baseMonkey} loop={'infinte'} width={'600px'}/> */}
      <GameStartCount open={openStartCount} text={seconds ? seconds : '시작!'} />
    </div>
  )
}