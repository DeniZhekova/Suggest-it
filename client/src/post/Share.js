import React from 'react'

import { Twitter,Facebook,Mail,Whatsapp,Reddit,Linkedin,Pinterest } from 'react-social-sharing';

const Share = (props) => {
    const url = window.location.href;
    const {title}=props;
    const shareText = title;
    const styles = {
      background: '#0E2F56'
    };
    
  return (
    <div>
      <div>
        <Twitter
          solid small
          link={url} 
          label={shareText}
          style={styles}
        />
        <Facebook solid small style={styles} link="http://sharingbuttons.io"/>
        <Mail solid small link={url} style={styles} subject={`Suggest-it: ${shareText}`}/>
        <Pinterest solid small message={`Suggest-it: ${shareText}`} link={url}/>
        <Linkedin solid small message={`Suggest-it: ${shareText}`} link={url}/>
        <Reddit solid small link="http://sharingbuttons.io"/>
        <Whatsapp solid small message={`Suggest-it: ${shareText}`} link={url}/>
      </div>
    </div>
  )

}

export default Share;
