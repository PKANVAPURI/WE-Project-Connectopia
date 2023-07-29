import React, { useEffect, useRef, useState } from "react";
import {useMeeting,Constants,} from "@videosdk.live/react-sdk";
import SpeakerView from "./SpeakerView";
import ViewerView from "./ViewerView";
import RealTimeGraphPlotter from "./Graphplotter";
import Whiteboard from "./CollabBoard";
import Chat from "./Chat";
// this the initial page => where you wait to join the meet

function Container(props) {
  const [joined, setJoined] = useState(null);
  //Get the method which will be used to join the meeting.
  const { join } = useMeeting();
  
  const mMeeting = useMeeting({
    onMeetingJoined: () => {
      //we will pin the local participant if he joins in CONFERENCE mode
      if (mMeetingRef.current.localParticipant.mode === "CONFERENCE") {
        mMeetingRef.current.localParticipant.pin();
      }
      setJoined("JOINED");
    },
    //callback for when meeting is left
    onMeetingLeft: () => {
      props.onMeetingLeave();
    },
    //callback for when there is error in meeting
    onError: (error) => {
      alert(error.message);
    },
  });
  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };
    const mMeetingRef = useRef(mMeeting);
    useEffect(() => {
    mMeetingRef.current = mMeeting;
  }, [mMeeting]);
console.log(mMeeting)
  return (
    <div className="container">
      <h4>Meeting Id: {props.meetingId}</h4>
      {joined && joined === "JOINED" ? (
        mMeeting.localParticipant.mode === Constants.modes.CONFERENCE ? (
          <>
            <SpeakerView />
          </>
          
        ) : mMeeting.localParticipant.mode === Constants.modes.VIEWER ? (
          <>
            <ViewerView />
            <RealTimeGraphPlotter/>
            <Whiteboard/>
            <Chat/>
          </>
        ) : null
      ) : joined && joined === "JOINING" ? (
        <p>Joining the meeting...</p>
      ) : (
        <button className="btn btn-warning" onClick={joinMeeting}>Join</button>
      )}
    </div>
  );
}
export default Container
