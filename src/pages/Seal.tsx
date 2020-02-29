import React, { useState } from 'react';
import styles from './Welcome.less';
import { Document, Page } from 'react-pdf';
import { Button, Upload, Row, Col, Card } from 'antd';
import Drr from '../components/DragResizeRotate';
import { UploadOutlined } from '@ant-design/icons';
import request from '@/utils/request';
import Meta from 'antd/lib/card/Meta';

export interface PdfPage {
  width: number
  height: number
}

export interface PdfDocument {
  pages: PdfPage[]
  pageIndex: number
  filename: string
  ref: any // 引用pdf
}

export interface PdfSign {
  documents: PdfDocument[]
  docIndex: number
}

class Index extends React.Component<PdfSign> {
  constructor(props) {
    super(props)
    this.state = {
      pdfSign: {
        documents: []
      },
      uploadFiles: [],
      seals: []
    }
  }

  const listSeals = () => {
    request('/api/v1/seal/list').then(resp => {
      this.setState(state => {
        return {
          ...state, seals: resp
        }
      })
    })
  }

  componentDidMount = () => {
    this.listSeals()
  }

  render() {
    const { uploadFiles, pdfSign, seals } = this.state

    // 上传文档
    const upload = () => {
      const formData = new FormData();
      uploadFiles.forEach(file => {
        formData.append('files', file);
      });
      request('/api/v1/file/upload', {
        method: 'post',
        data: formData,
      }).then(resp => {
        if (resp && resp.length > 0) {
          this.setState(state => {
            uploadFiles
            resp.forEach(filename => {
              pdfSign.documents.push({ filename })
            });
            return { ...state, uploadFiles: [] }
          })
        }
      })
    }

    return (
      <>
        <hr />

        <Upload fileList={uploadFiles} multiple={true}
          onRemove={file => {
            const index = uploadFiles.indexOf(file)
            const list = uploadFiles.slice()
            list.splice(index, 1);
            this.setState(state => ({ ...state, uploadFiles: list }))
          }}
          beforeUpload={file => {
            uploadFiles.push(file)
            this.setState(state => ({ ...state }))
            return false
          }}>
          <Button>
            选择文件
            <UploadOutlined />
          </Button>
        </Upload>
        <br />
        <Button onClick={upload}>上传文件</Button>
        <Button onClick={() => {
          this.setState(state => {
            const { pdfSign } = state
            const { docIndex, documents } = pdfSign
            let index = docIndex && docIndex - 1
            if (index < 0) index = 0
            return {
              ...state, pdfSign: {
                ...pdfSign, docIndex: index
              }
            }
          })
        }}>文档--</Button>
        <Button onClick={() => {
          this.setState(state => {
            const { pdfSign } = state
            const { docIndex, documents } = pdfSign
            let index = docIndex && docIndex + 1 || 1
            if (index >= documents.length) index = documents.length - 1
            return {
              ...state, pdfSign: {
                ...pdfSign, docIndex: index
              }
            }
          })
        }}>文档++</Button>
        <Button onClick={() => {
          this.setState(state => {
            const { pdfSign } = state
            const { docIndex, documents } = pdfSign
            const doc = documents[docIndex]
            if (!doc) return
            let index = doc.pageIndex - 1
            if (index < 0) index = 0
            doc.pageIndex = index
            return { ...state }
          })
        }}>页码--</Button>
        <Button onClick={() => {
          this.setState(state => {
            const { pdfSign } = state
            const { docIndex, documents } = pdfSign
            const doc = documents[docIndex]
            if (!doc) return
            let index = doc.pageIndex + 1
            if (index >= doc.ref.pages.length) index = doc.ref.pages.length - 1
            doc.pageIndex = index
            return { ...state }
          })
        }}>页码++</Button>

        <hr />

        <Row>
          {
            seals && seals.content && seals.content.map((item, key) => {
              return (
                <Card
                  // hoverable
                  style={{ textAlign: 'center', margin: '4px', width: '80px', paddingTop: '4px' }}
                  bodyStyle={{ padding: 0, margin: '10px' }}
                  cover={
                    <img alt="图片"
                      src={`/api/v1/file/download?filename=${item.filename}`}
                      style={{ width: item.width, height: item.height, display: 'inline-block' }}
                    />
                  }
                >
                  <Meta title={item.name} />
                </Card>
              )
            })
          }
        </Row>

        <hr />

        {
          pdfSign.documents && pdfSign.documents.map((doc, docIndex) => {
            if (!pdfSign.docIndex && 0 == docIndex || pdfSign.docIndex == docIndex) {
              return (
                <div key={`pdf-document-${docIndex}-div`}>
                  {`第${pdfSign.docIndex && pdfSign.docIndex + 1 || 1}/${pdfSign.documents.length}份文件
                  >>${doc.filename}<<
                  第${doc.pageIndex && doc.pageIndex + 1 || 1}/${doc.pages && doc.pages.length || '-'}页`}
                  <Document file={`/api/v1/file/download?filename=${doc.filename}`} key={`pdf-document-${docIndex}-document`}
                    ref={ref => {
                      if (ref) {
                        pdfSign.documents[docIndex].ref = ref
                        if (ref.pages) {
                          pdfSign.documents[docIndex].pages = pdfSign.documents[docIndex].pages || new Array(ref.pages.length)
                          const docPageIndex = doc.pageIndex || 0
                          if (ref.pages[docPageIndex]) {
                            pdfSign.docIndex = docIndex
                            pdfSign.documents[docIndex].pageIndex = docPageIndex
                            pdfSign.documents[docIndex].pages[docPageIndex] = {
                              width: Number.parseInt(ref.pages[docPageIndex].firstChild.style.width),
                              height: Number.parseInt(ref.pages[docPageIndex].firstChild.style.height)
                            }
                          }
                        }
                      }
                    }}>
                    <Page pageIndex={doc.pageIndex || 0} key={`pdf-document-${docIndex}-page`}
                      renderMode="svg" renderTextLayer={false}>
                    </Page>
                  </Document>
                </div>)
            }
            return (<div key={`pdf-document-${docIndex}-empty`}></div>)
          })
        }

      </>
    )
  }
}

export default Index;



