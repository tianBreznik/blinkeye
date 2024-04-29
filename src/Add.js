// import React from 'react';
// import AdSense from 'react-adsense';
// const AddComponent = () => {
//   return (
//     <div>
//       {/* Your other content */}
//       <AdSense.Google
//         client='ca-pub-5602626647444832'  // Replace with your AdSense client ID
//         slot='8897748949'      // Replace with your AdSense ad unit ID
//         style={{ display: 'block' }}
//         format='auto'
//       />
//       {/* Your other content */}
//     </div>
//   );
// };
// export default AddComponent;
import React, { useEffect  } from 'react';
// import React from 'react';

// export default class AdComponent extends React.Component {
//   componentDidMount () {
//     (window.adsbygoogle = window.adsbygoogle || []).push({});
//   }

// render () {
//     return (
//         <ins className="adsbygoogle"
//         style={{display: 'block'}}
//         data-ad-client="ca-pub-5602626647444832"
//         data-ad-slot="8897748949"
//         data-ad-format="auto"
//         data-full-width-responsive="true"></ins>
//     );
//   }
// }
const AdsComponent = (props) => {
    const { dataAdSlot } = props;  



    useEffect(() => {

        // const scriptelement = document.querySelector(
        //     'script[src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5602626647444832"]'
        // );

        window.adsbygoogle = window.adsbygoogle || []
        window.adsbygoogle.push({})
       
        // const handleScriptLoad = () => {
        //     try {
        //         if(window.adsbygoogle){
        //             console.log("pushing ads");
        //             window.adsbygoogle.push({});
        //         }
        //         else {
        //             scriptelement.addEventListener("load", handleScriptLoad);
        //             console.log("waiting for adsense");
        //         }
        //     }
        //     catch (e) {
        //         console.log("error in adsense", e);
    
        //     }
        // };


        // handleScriptLoad();

        // try {
        //     // if (adsbygoogle && !adsbygoogle.loaded)
        //     //     (window.adsbygoogle = window.adsbygoogle || []).push({});
        //     if (window.adsbygoogle && window.adsbygoogle.loaded)
        //         window.adsbygoogle.push({});
        // }

        // catch (e) {
        //     console.log("error in adsense", e);

        // }

    },[dataAdSlot]);



    return (
        <div key={dataAdSlot} id={dataAdSlot}>
            <ins className="adsbygoogle"
                style={{display: 'block'}}
                data-ad-client="ca-pub-5602626647444832"
                data-ad-slot={dataAdSlot}
                data-ad-format="auto"
                data-full-width-responsive="true">
            </ins>
        </div>
    );
};

export default AdsComponent;

