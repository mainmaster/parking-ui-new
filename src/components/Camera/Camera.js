import {useEffect, useRef} from "react";
import styles from './Camera.module.scss'
import {Button} from "react-bootstrap";


const Camera = ({ src, id }) => {

  const stream = useRef({})
  const pc = useRef()
  const ws = useRef()

  let media = 'video+audio'

  useEffect(()=>{
    async function PeerConnection(media) {
      const pc = new RTCPeerConnection({
        iceServers: [{urls: 'stun:stun.l.google.com:19302'}]
      })

      const localTracks = []

      if (/camera|microphone/.test(media)) {
        const tracks = await getMediaTracks('user', {
          video: media.indexOf('camera') >= 0,
          audio: media.indexOf('microphone') >= 0,
        })
        tracks.forEach(track => {
          pc.addTransceiver(track, {direction: 'sendonly'})
          if (track.kind === 'video') localTracks.push(track)
        })
      }

      if (media.indexOf('display') >= 0) {
        const tracks = await getMediaTracks('display', {
          video: true,
          audio: media.indexOf('speaker') >= 0,
        })
        tracks.forEach(track => {
          pc.addTransceiver(track, {direction: 'sendonly'})
          if (track.kind === 'video') localTracks.push(track)
        })
      }

      if (/video|audio/.test(media)) {
        const tracks = ['video', 'audio']
            .filter(kind => media.indexOf(kind) >= 0)
            .map(kind => pc.addTransceiver(kind, {direction: 'recvonly'}).receiver.track)
        localTracks.push(...tracks)
      }

      stream.current.srcObject = new MediaStream(localTracks)

      // console.log(new MediaStream(localTracks).getVideoTracks())
      return pc
    }

    async function getMediaTracks(media, constraints) {
      try {
        const stream = media === 'user'
            ? await navigator.mediaDevices.getUserMedia(constraints)
            : await navigator.mediaDevices.getDisplayMedia(constraints)
        return stream.getTracks()
      } catch (e) {
        console.warn(e)
        return []
      }
    }

    async function connect(media) {
      pc.current = await PeerConnection(media)
      ws.current = new WebSocket(src)
      ws.current.addEventListener('open', () => {
        pc.current.addEventListener('icecandidate', ev => {
          if (!ev.candidate) return
          const msg = {type: 'webrtc/candidate', value: ev.candidate.candidate}
          ws.current.send(JSON.stringify(msg))
        })

        pc.current.createOffer().then(offer => pc.current.setLocalDescription(offer)).then(() => {
          const msg = {type: 'webrtc/offer', value: pc.current.localDescription.sdp}
          ws.current.send(JSON.stringify(msg))
        })
      })

      ws.current.addEventListener('message', ev => {
        const msg = JSON.parse(ev.data)

        if (msg.type === 'webrtc/candidate') {
          pc.current.addIceCandidate({candidate: msg.value, sdpMid: '0'})
        } else if (msg.type === 'webrtc/answer') {
          pc.current.setRemoteDescription({type: 'answer', sdp: msg.value})
        }
      })

    }

    connect( 'video+audio')

    return ()=> {
      if(ws.current?.close){
        pc.current?.close()
        return ws.current.close()

      }else{
        pc.current?.close()
        return ws.current?.close()
      }
    }
  },[])


  return <>
    <video className={styles.player} autoPlay ref={stream} muted playsInline  id="video"/>
  </>
}

export default Camera
