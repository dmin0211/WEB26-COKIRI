import { useState } from 'react';
import { useMutation } from 'react-query';
import { useRecoilState, useRecoilValue } from 'recoil';
import PropTypes from 'prop-types';

import ModalCommon from 'src/components/modals/Common';
import ImageInput from 'src/components/inputs/ImageInput';
import InputCommon from 'src/components/inputs/Common';
import ProfileImage from 'src/components/images/ProfileImage';
import { Row, Col } from 'src/components/Grid';

import {
  USER_SETTING_PROFILE_IMAGE_SIZE,
  DASHBOARD_BASIC_SETTING_MODAL_WIDTH,
} from 'src/globals/constants';
import { DEFAULT_PROFILE_IMAGE } from 'src/globals/images';

import userAtom from 'src/recoil/user';
import dashboardUserInfoAtom, { dashboardHistoriesSelector } from 'src/recoil/dashboardUserInfo';

import { Fetcher } from 'src/utils';
import { getBirthdayFormat } from 'src/utils/moment';

import { Label, ImageHolder, ImageCover } from './style';

interface Props {
  onClose: VoidFunction;
}

function DashboardBasicSettingModal({ onClose }: Props) {
  const user = useRecoilValue(userAtom);
  const [dashboardUserInfo, setDashboardUserInfo] = useRecoilState(dashboardUserInfoAtom);
  const dashboardHistories = useRecoilValue(dashboardHistoriesSelector);
  const [name, setName] = useState(dashboardUserInfo.name ?? '');
  const [email, setEmail] = useState(dashboardUserInfo.email ?? '');
  const [school, setSchool] = useState(dashboardUserInfo.school ?? '');
  const [region, setRegion] = useState(dashboardUserInfo.region ?? '');
  const [birthday, setBirthday] = useState(getBirthdayFormat(dashboardUserInfo.birthday) ?? '');
  const [phoneNumber, setPhoneNumber] = useState(dashboardUserInfo.phoneNumber ?? '');
  const [profileImage, setProfileImage] = useState(
    dashboardUserInfo.profileImage ?? DEFAULT_PROFILE_IMAGE,
  );

  const { mutate } = useMutation(
    () =>
      Fetcher.putDashboardUserInfo(user, {
        ...dashboardUserInfo,
        name,
        phoneNumber,
        birthday,
        region,
        school,
        email,
        profileImage,
      }),
    {
      onSuccess: (dashboard) => {
        setDashboardUserInfo({ ...dashboard, dashboardHistories });
        onClose();
      },
    },
  );

  const handleImageUpload = (url: string) => {
    setProfileImage(url);
  };

  const handleConfirm = () => {
    mutate();
  };

  return (
    <ModalCommon
      width={DASHBOARD_BASIC_SETTING_MODAL_WIDTH}
      onConfirm={handleConfirm}
      onClose={onClose}
      confirm='저장'
      close='취소'
    >
      <ImageHolder>
        <ImageInput onImageUpload={handleImageUpload}>
          <ImageCover>변경</ImageCover>
        </ImageInput>
        <ProfileImage
          size={USER_SETTING_PROFILE_IMAGE_SIZE}
          profileImage={profileImage}
          username=''
        />
      </ImageHolder>
      <Row justifyContent='space-evenly'>
        <Col>
          <Row>
            <Label>name</Label>
            <InputCommon bind={[name, setName]} placeholder={name} title='name' />
          </Row>
          <Row>
            <Label>birthday</Label>
            <InputCommon bind={[birthday, setBirthday]} placeholder={birthday} title='birthday' />
          </Row>
          <Row>
            <Label>region</Label>
            <InputCommon bind={[region, setRegion]} placeholder={region} title='region' />
          </Row>
          <Row>
            <Label>phone number</Label>
            <InputCommon
              bind={[phoneNumber, setPhoneNumber]}
              placeholder={phoneNumber}
              title='phone-number'
            />
          </Row>
          <Row>
            <Label>email</Label>
            <InputCommon bind={[email, setEmail]} placeholder={email} title='email' />
          </Row>
          <Row>
            <Label>school</Label>
            <InputCommon bind={[school, setSchool]} placeholder={school} title='school' />
          </Row>
        </Col>
      </Row>
    </ModalCommon>
  );
}

DashboardBasicSettingModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default DashboardBasicSettingModal;
