import React, { useState } from 'react';
import styles from './Welcome.less';
import { Document, Page } from 'react-pdf';
import { Button, Upload, Row, Col, Card, message } from 'antd';
import Drr from '../components/DragResizeRotate';
import { UploadOutlined } from '@ant-design/icons';
import request from '@/utils/request';
import Meta from 'antd/lib/card/Meta';

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      files: []
    }
  }

  componentDidMount = () => {
    request("/api/v1/signed/list")
      .then(resp => {
        console.log(resp)
        if (!resp)
          return
        this.setState(state => {
          return {
            ...state, files: resp
          }
        })
      })
  }
  render() {
    const { files } = this.state

    return (
      <div>
        签署文件列表(点击下载):
        {files && files.map(file => {
          return (
            <Row>
              <Button onClick={() => {
                window.open(`/api/v1/file/download?filename=signed%2F${file}`)
              }}>{file}</Button>
            </Row>
          )
        })}
      </div>
    )
  }
}

export default Index;



