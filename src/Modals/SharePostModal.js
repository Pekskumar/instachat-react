import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
// import { apiResponse } from "../services/APIResponse";
// import { API_URL } from "../services/APIRoute";
// import { apiCall } from "../services/AxiosService";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  FacebookShareCount,
  GabIcon,
  GabShareButton,
  HatenaIcon,
  HatenaShareButton,
  HatenaShareCount,
  InstapaperIcon,
  InstapaperShareButton,
  LineIcon,
  LineShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  LivejournalIcon,
  LivejournalShareButton,
  MailruIcon,
  MailruShareButton,
  OKIcon,
  OKShareButton,
  OKShareCount,
  PinterestIcon,
  PinterestShareButton,
  PinterestShareCount,
  PocketIcon,
  PocketShareButton,
  RedditIcon,
  RedditShareButton,
  RedditShareCount,
  TelegramIcon,
  TelegramShareButton,
  TumblrIcon,
  TumblrShareButton,
  TumblrShareCount,
  TwitterShareButton,
  ViberIcon,
  ViberShareButton,
  VKIcon,
  VKShareButton,
  VKShareCount,
  WeiboIcon,
  WeiboShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  WorkplaceIcon,
  WorkplaceShareButton,
  XIcon,
} from "react-share";

const SharePostModal = (props) => {
  let shareUrl = "";
  let title = "";
  shareUrl = `http://localhost:3000/profile/${props?.ShareProfileData?.userId?._id}`;
  title = `Follow ${props?.ShareProfileData?.userId?.displayname} Insta social post`;

  return (
    <>
      <Modal className="" size="sm" centered {...props}>
        <Modal.Header closeButton>
          <div style={{ visibility: "hidden" }}>A</div>
          <Modal.Title id="contained-modal-title-vcenter">
            Share Post
          </Modal.Title>
          <div style={{ visibility: "hidden" }}>A</div>
        </Modal.Header>

        <div
          className="Demo__container d-flex my-4    justify-content-evenly
    align-items-center"
        >
          <div className="Demo__some-network">
            <FacebookShareButton
              url={shareUrl}
              title={title}
              className="Demo__some-network__share-button"
            >
              <FacebookIcon size={32} round />
            </FacebookShareButton>

            <div>
              <FacebookShareCount
                url={shareUrl}
                title={title}
                className="Demo__some-network__share-count"
              >
                {(count) => count}
              </FacebookShareCount>
            </div>
          </div>

          {/* <div className="Demo__some-network">
            <FacebookMessengerShareButton
              url={shareUrl}
              appId="521270401588372"
              className="Demo__some-network__share-button"
            >
              <FacebookMessengerIcon size={32} round />
            </FacebookMessengerShareButton>
          </div> */}

          <div className="Demo__some-network">
            <TwitterShareButton
              url={shareUrl}
              title={title}
              className="Demo__some-network__share-button"
            >
              <XIcon size={32} round />
            </TwitterShareButton>
          </div>

          <div className="Demo__some-network">
            <TelegramShareButton
              url={shareUrl}
              title={title}
              className="Demo__some-network__share-button"
            >
              <TelegramIcon size={32} round />
            </TelegramShareButton>
          </div>

          <div className="Demo__some-network">
            <WhatsappShareButton url={shareUrl} title={title}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
          </div>

          <div className="Demo__some-network">
            <LinkedinShareButton
              url={shareUrl}
              title={title}
              className="Demo__some-network__share-button"
            >
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SharePostModal;
