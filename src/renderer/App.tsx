import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';

const Hello = () => {
  const [faceState, setFaceState] = useState({
    face: 'ð',
    state: 'setting',
  });
  const [faces, setFaces] = useState<
    {
      id: number;
      emoji: string;
      location?: string;
      base64?: string;
      title: string;
    }[]
  >([
    { id: 1, emoji: 'ð', title: 'çé¡' },
    { id: 2, emoji: 'ð', title: 'åã¶' },
    { id: 3, emoji: 'ð¡', title: 'æã' },
    { id: 4, emoji: 'ð­', title: 'åã' },
    { id: 5, emoji: 'ð¤©', title: 'æ¥½ãã' },
  ]);

  useEffect(() => {
    // facesãå¨ã¦locationãè¨­å®ããããstateã'complete'ã«ãã
    if (
      faceState.state === 'setting' &&
      (faces.every((face) => face.location !== undefined) ||
        faces.every((face) => face.base64 !== undefined))
    ) {
      setFaceState({ ...faceState, state: 'complete' });
    }
  }, [faceState, faces]);

  // key binding: if state is 'complete', then 1-5 key will be enabled
  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) => {
      if (faceState.state === 'complete') {
        const { key } = e;
        if (key === '1') {
          setFaceState({ ...faceState, face: faces[0].emoji });
        } else if (key === '2') {
          setFaceState({ ...faceState, face: faces[1].emoji });
        } else if (key === '3') {
          setFaceState({ ...faceState, face: faces[2].emoji });
        } else if (key === '4') {
          setFaceState({ ...faceState, face: faces[3].emoji });
        } else if (key === '5') {
          setFaceState({ ...faceState, face: faces[4].emoji });
        }
      }
    };
    window.addEventListener('keydown', keydownHandler);
    return () => {
      window.removeEventListener('keydown', keydownHandler);
    };
  }, [faceState, faces]);

  const webcamRef = React.useRef(null);

  const capture = React.useCallback(() => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();

    // facesã®ä¸­ã§ãfaceState.faceã¨åãemojiãæã¤ãã®ã®ãbase64ã®å¤ãimageSrcã«ãã
    const newFaces = faces.map((face) => {
      if (face.emoji === faceState.face) {
        return { ...face, base64: imageSrc };
      }
      return face;
    });
    setFaces(newFaces);

    // faceStateã®faceãæ¬¡ã®ãã®ã«ãã
    const nextFace = faces.find((face) => face.emoji === faceState.face);
    if (nextFace) {
      const nextFaceIndex = faces.indexOf(nextFace) + 1;
      if (nextFaceIndex < faces.length) {
        setFaceState({ ...faceState, face: faces[nextFaceIndex].emoji });
      } else {
        setFaceState({ ...faceState, state: 'complete' });
      }
    }
  }, [webcamRef, faces, faceState]);

  return (
    <div>
      {faceState.state === 'setting' && (
        <>
          <div
            style={{
              position: 'relative',
              height: '100vh',
            }}
          >
            <Webcam
              style={{
                height: '100vh',
                width: '100vw',
                background: 'black',
                objectFit: 'cover',
              }}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 1280,
                height: 720,
                facingMode: 'user',
              }}
            />

            {faces.map((face) => {
              if (face.base64 !== undefined || face.location !== undefined)
                return <div className="shutter" key={face.id} />;
              return <></>;
            })}

            {/* <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100vw',
                height: '32px',
                pointerEvents: 'none',
                '-webkit-app-region': 'drag',
              }}
            /> */}

            <div
              style={{
                position: 'absolute',
                left: '24px',
                top: '24px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(16px)',
                borderRadius: '16px',

                display: 'grid',
                gap: '10px',
                fontWeight: 'bold',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '116px',
                }}
              >
                {faces.map((face, index) => (
                  <div
                    key={`a${face.id}`}
                    style={{
                      width: '100%',
                      height: '4px',
                      // indexãæåãæå¾ã®å ´åborderRadiusãè¨­å®ãã
                      borderRadius:
                        // eslint-disable-next-line no-nested-ternary
                        index === 0
                          ? '2px 0 0 2px'
                          : index === faces.length - 1
                          ? '0 2px 2px 0'
                          : '0',
                      // å®äºããfaceã®å ´åã¯backgroundãè¨­å®ãã
                      backgroundColor:
                        face.base64 !== undefined || face.location !== undefined
                          ? 'rgb(0, 170, 255, 0.7)'
                          : 'rgba(0, 0, 0, 0.1)',
                    }}
                  />
                ))}
                <p
                  style={{
                    marginLeft: '8px',
                    opacity: 0.5,
                  }}
                >
                  {
                    // a.faceã¨ä¸è´ããfacesã®idãè¡¨ç¤ºãã
                    faces.find((f) => f.emoji === faceState.face)?.id
                  }
                  /5
                </p>
              </div>
              <p
                style={{
                  textAlign: 'center',
                  marginTop: '8px',
                  opacity: 0.5,
                }}
              >
                åçãæ®ã
              </p>
              <p
                style={{
                  textAlign: 'center',
                  fontSize: '64px',
                }}
              >
                {
                  // faceState.faceã¨ä¸è´ããfacesã®emojiãè¡¨ç¤ºãã
                  faces.find((f) => f.emoji === faceState.face)?.emoji
                }
              </p>
              <p
                style={{
                  textAlign: 'center',
                  fontSize: '24px',
                }}
              >
                {
                  // faceState.faceã¨ä¸è´ããfacesã®titleãè¡¨ç¤ºãã
                  faces.find((f) => f.emoji === faceState.face)?.title
                }
              </p>
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: '24px',
                left: '24px',
                display: 'grid',
                gap: '8px',
              }}
            >
              <button
                onClick={capture}
                type="button"
                style={{
                  backgroundColor: '#00AAFF',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '24px',
                  padding: '8px 48px',
                  height: '64px',
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow:
                    '0px 4px 4px rgba(0, 0, 0, 0.1), 0px 2px 2px rgba(0, 0, 0, 0.1), inset 0px -2px 2px rgba(0, 0, 0, 0.25), inset 0px 2px 2px rgba(255, 255, 255, 0.25)',
                }}
              >
                ð¸ åçãæ®ã
              </button>
              <label
                htmlFor="file"
                style={{
                  width: 'fit-content',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  padding: '4px 16px',
                  borderRadius: '16px',
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  boxShadow:
                    '0px 4px 4px rgba(0, 0, 0, 0.1), 0px 2px 2px rgba(0, 0, 0, 0.1), inset 0px -2px 2px rgba(0, 0, 0, 0.25), inset 0px 2px 2px rgba(255, 255, 255, 0.25)',
                }}
              >
                <input
                  id="file"
                  type="file"
                  accept="image/*"
                  style={{
                    display: 'none',
                  }}
                  onChange={(e) => {
                    if (e.target.files) {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onload = (e2) => {
                        if (e2.target) {
                          const localURL = e2.target.result;
                        }
                      };
                      // ç¹å®ã®facesã«å¯¾ãã¦ãlocationãè¨­å®ããã
                      console.log(encodeURI(`file:${file.path}`));
                      setFaces((prev) => {
                        const newFaces = [...prev];
                        newFaces.find(
                          (f) => f.emoji === faceState.face
                        )!.location = encodeURI(`file:${file.path}`);
                        return newFaces;
                      });

                      // faceStateã®faceãæ¬¡ã®ãã®ã«ãã
                      const nextFace = faces.find(
                        (face) => face.emoji === faceState.face
                      );
                      if (nextFace) {
                        const nextFaceIndex = faces.indexOf(nextFace) + 1;
                        if (nextFaceIndex < faces.length) {
                          setFaceState({
                            ...faceState,
                            face: faces[nextFaceIndex].emoji,
                          });
                        } else {
                          setFaceState({ ...faceState, state: 'complete' });
                        }
                      }
                    }
                  }}
                />
                åçãèª­ã¿è¾¼ã
              </label>
            </div>
          </div>
        </>
      )}
      {faceState.state === 'complete' && (
        <>
          <div
            style={{
              position: 'relative',
              height: '100vh',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setFaceState({ face: 'ð', state: 'setting' });
                setFaces([
                  { id: 1, emoji: 'ð', title: 'çé¡' },
                  { id: 2, emoji: 'ð', title: 'åã¶' },
                  { id: 3, emoji: 'ð¡', title: 'æã' },
                  { id: 4, emoji: 'ð­', title: 'åã' },
                  { id: 5, emoji: 'ð¤©', title: 'æ¥½ãã' },
                ]);
              }}
              style={{
                position: 'absolute',
                top: '24px',
                left: '24px',
                height: '56px',
                width: '56px',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                padding: '16px',
                borderRadius: '16px',
                border: 'none',
                backdropFilter: 'blur(16px)',
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.5">
                  <path
                    d="M16 22L6 12L16 2L17.775 3.775L9.55 12L17.775 20.225L16 22Z"
                    fill="black"
                  />
                </g>
              </svg>
            </button>
            <div
              style={{
                // background Image ã«faceState.faceã¨åãfacesã®emojiã¨è©²å½ããobjectã®locationãè¨­å®ãã
                backgroundImage: faces.find(
                  (face) => face.emoji === faceState.face
                )?.location
                  ? `url(${
                      faces.find((face) => face.emoji === faceState.face)
                        ?.location
                    })`
                  : `url(${
                      faces.find((face) => face.emoji === faceState.face)
                        ?.base64
                    })`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '100vh',
                width: '100vw',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '24px',
                bottom: '24px',
                padding: '8px',
                gap: '8px',
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 54px)',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '16px',
                backdropFilter: 'blur(16px)',
              }}
            >
              {faces.map((face, index) => (
                <button
                  type="button"
                  key={face.id}
                  onClick={() =>
                    setFaceState({ face: face.emoji, state: 'complete' })
                  }
                  style={{
                    transition: 'all 0.2s ease',
                    padding: '6px 4px',
                    borderRadius: '8px',
                    display: 'grid',
                    gap: '6px',
                    border: 'none',
                    justifyContent: 'center',
                    backgroundColor:
                      face.emoji === faceState.face
                        ? 'rgba(255,255,255, 1)'
                        : 'rgba(255,255,255, 0)',
                  }}
                >
                  <p
                    style={{
                      fontSize: '8px',
                      opacity: 0.3,
                    }}
                  >
                    {index + 1}
                  </p>
                  <h2
                    style={{
                      fontSize: '32px',
                    }}
                  >
                    {face.emoji}
                  </h2>
                  <p
                    style={{
                      fontSize: '16px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {face.title}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
