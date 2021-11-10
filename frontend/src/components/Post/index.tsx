import { IoHeartOutline, IoPaperPlaneOutline, IoChatbubbleOutline } from 'react-icons/io5';
import { useState } from 'react';

import PostProfile from 'src/components/PostProfile';
import CommentButton from 'src/components/buttons/CommentButton';
import LikeButton from 'src/components/buttons/LikeButton';
import EchoButton from 'src/components/buttons/EchoButton';
import PostImage from 'src/components/PostImage';
import PostContent from 'src/components/PostContent';
import PostReview from 'src/components/PostReview';
import { Row } from 'src/components/Grid';
import LikeListButton from 'src/components/buttons/LikeListButton';
// import LikeListModal from 'src/components/modals/LikeListModal';

import { Wrapper, Buttons } from './style';

function Post() {
  const content = `asfdsgasfdafsdfasdafsdafsdafsdasfdfasdafsdasdfasfdasfdafsdasfdafsdafsdafdsafdsafsdsdsdsdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddds`;

  return (
    <Wrapper>
      <PostProfile />
      <PostImage />
      <Row justifyContent='flex-start'>
        <Buttons>
          <CommentButton>
            <IoHeartOutline />
          </CommentButton>
          <LikeButton>
            <IoChatbubbleOutline />
          </LikeButton>
          <EchoButton href='echo/123'>
            <IoPaperPlaneOutline />
          </EchoButton>
        </Buttons>
      </Row>
      <LikeListButton length='4' onClick={likeListModal} />
      <PostContent content={content} />
      <PostReview />
    </Wrapper>
  );
}

export default Post;
