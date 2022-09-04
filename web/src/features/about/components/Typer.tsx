import React, { useRef, useState } from "react";

import Typewriter, { TypewriterClass } from "typewriter-effect";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export const DynamicTypist = () => {
  let texts = [
    "transportation",
    "environmental",
    "trade",
    "economic",
    "agriculture",
    "election",
    "police",
    "demographic",
  ];
  //   texts = texts.slice(texts.length - 2);
  shuffleArray(texts);
  texts.push("open")
  const tw = useRef(null);

  function runTyping(t: TypewriterClass, reset = false) {
    if (!t) return;
    if (reset) {
      t.deleteAll();
    }
    for (let index = 0; index < texts.length; index++) {
      const element = texts[index];
      t.typeString(element).pauseFor(1500);
      if (!(index == texts.length - 1)) {
        t.deleteAll();
      }
      t.start();
    }
  }

  return (
    //   TODO: make re-run of typing happen outside just the typing span
    // Probably have a state in parent component, update, and re-render
    // this component with new prop
    <div onClick={() => runTyping(tw.current, true)}>
      <Typewriter
        //   options={{
        //     strings: texts,
        //     autoStart: true,
        //     // loop: true,

        //   }}
        onInit={(t) => {
          tw.current = t;
          runTyping(tw.current);
        }}
      />
    </div>
  );
};
