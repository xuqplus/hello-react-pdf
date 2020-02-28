import React, { useState } from 'react';
import styles from './Welcome.less';
import { Document, Page } from 'react-pdf';
import { Button, Input, Upload } from 'antd';
import Drr from '../components/DragResizeRotate';
import { UploadOutlined } from '@ant-design/icons';
import request from 'umi-request';

export interface DrrData {
  src: string;
  top: number;
  left: number;
  width: number;
  height: number;
  rotateAngle: number;
  handleRotate: any;
  handleResize: any;
  handleDrag: any;
  pageIndex: number;
}

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: []
    };
  }

  render() {
    const { fileList } = this.state;

    const upload = () => {
      const formData = new FormData();

      console.log(this.state)
      fileList.forEach(file => {
        formData.append('files', file);
      });

      this.setState({
        uploading: true,
      });

      request('/api/v1/file/upload', {
        method: 'post',
        data: formData,

      }).then(resp => {
        console.log(resp)
      })
    }

    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    return (
      <div>
        <Upload {...props}>
          <Button>
            选择文件
            <UploadOutlined />
          </Button>
        </Upload>
        <br />
        <Button onClick={upload}>确认上传</Button>
      </div>
    )
  }
}

export default Index;



