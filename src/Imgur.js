
import React, { useState, useEffect  } from 'react';
import { useAsync } from "react-async-hook";

var source;
const ImgurComponent = () => {  
    const [img, setImg] = useState(null);

    function randomString() {   
        var chars = process.env.REACT_APP_IMGUR_STR; 
        var stringlength = 5; /* could be 6 or 7, but takes forever because there are lots of dead images */
        var text = '';
        for (var i = 0; i < stringlength; i++) {
          var rnum = Math.floor(Math.random() * chars.length);
          text += chars.substring(rnum,rnum+1);
        }

        var source = 'https://i.imgur.com/' + text + '.jpg';

        var image = new Image();
        image.onload = function() {
          if (this.width == 161) {
            randomString();
          } else {
            setImg(source);
          }
        };
        image.src = source;
    };

    useEffect(() => {
        // call api or anything
        randomString();
     });

    //return imgur component
    return (
        <div key={img}>
            <img className="imgurimg" src={img}></img>
        </div>
    );
};

export default ImgurComponent;


