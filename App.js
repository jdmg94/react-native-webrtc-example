import Socket from 'socket.io-client';
import {StyleSheet} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import {
  RTCView,
  RTCPeerConnection,
  RTCIceCandidate,
  mediaDevices,
} from 'react-native-webrtc';

const config = {
  iceServers: [
    {
      urls: ['stun:stun.l.google.com:19302'],
    },
  ],
};

const styles = StyleSheet.create({
  viewer: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#4F4',
  },
});

const App = () => {
  // you have to keep the peer connections without re-rendering
  // every time a peer connects/disconnects
  const peerConnections = useRef(new Map());
  const [stream, setStream] = useState(null);
  const [socket] = useState(Socket.connect('ws://8f9e54dd.ngrok.io')); // replace with your host machine's IP or public url

  useEffect(() => {
    socket.on('connect', () => {
      if (stream) socket.emit('broadcaster');

      socket.on('watcher', async id => {
        const connectionBuffer = new RTCPeerConnection(config);

        stream.getTracks.forEach(track =>
          connectionBuffer.addTrack(track, stream),
        );

        connectionBuffer.onicecandidate = ({candidate}) => {
          if (candidate) socket.emit('candidate', id, candidate);
        };

        const localDescription = await connectionBuffer.createOffer();

        await connectionBuffer.setLocalDescription(localDescription);

        socket.emit('offer', id, connectionBuffer.localDescription);

        peerConnections.current.set(id, connectionBuffer);
      });

      socket.on('candidate', (id, candidate) => {
        const candidateBuffer = new RTCIceCandidate(candidate);
        const connectionBuffer = peerConnections.current.get(id);

        connectionBuffer.addIceCandidate(candidateBuffer);
      });

      socket.on('answer', (id, remoteOfferDescription) => {
        const connectionBuffer = peerConnections.current.get(id);

        connectionBuffer.setRemoteDescription(remoteOfferDescription);
      });

      socket.on('disconnectPeer', id => {
        peerConnections.current.get(id).close();
        peerConnections.current.delete(id);
      });
    });

    return () => {
      if (socket.connected) socket.close(); // close the socket if the view is unmounted
    };
  }, [socket, stream]);

  useEffect(() => {
    if (!stream) {
      (async () => {
        const availableDevices = await mediaDevices.enumerateDevices();
        const {deviceId: sourceId} = availableDevices.find(
          // once we get the stream we can just call .switchCamera() on the track to switch without re-negotiating
          // ref: https://github.com/react-native-webrtc/react-native-webrtc#mediastreamtrackprototype_switchcamera
          device => device.kind === 'videoinput' && device.facing === 'front',
        );

        const streamBuffer = await mediaDevices.getUserMedia({
          audio: true,
          video: {
            mandatory: {
              // Provide your own width, height and frame rate here
              minWidth: 500,
              minHeight: 300,
              minFrameRate: 30,
            },
            facingMode: 'user',
            optional: [{sourceId}],
          },
        });

        setStream(streamBuffer);
      })();
    }
  }, [stream]);

  return <RTCView streamURL={stream?.toURL()} style={styles.viewer} />;
};

export default App;
