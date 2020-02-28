import React, { useState } from 'react';
import styles from './Welcome.less';
import { Document, Page } from 'react-pdf';
import { Button } from 'antd';
import Drr from '../components/DragResizeRotate';

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

const Index: React.FC = props => {

  let aRef = React.createRef();

  let [drrs, setDrrs] = useState([]);

  const [pageIndex, setPageIndex] = useState(0)

  const prev = () => {
    let i = pageIndex - 1
    if (i < 0) {
      i = 0
    }
    setPageIndex(i)
  }

  const next = () => {
    let i = pageIndex + 1
    if (i >= aRef.pages.length) {
      i = aRef.pages.length - 1
    }
    setPageIndex(i)
  }

  const add = () => {
    const item: DrrData = {
      src: 'favicon.png',
      left: 0,
      top: 0,
      width: 64,
      height: 64,
      rotateAngle: 0,
      pageIndex: pageIndex,
      handleDrag: (deltaX: number, deltaY: number) => {
        item.top += deltaY
        item.left += deltaX
        setDrrs([...drrs])
      },
      handleResize: (style, isShiftKey, type) => {
        let { top, left, width, height } = style
        item.top = Math.round(top)
        item.left = Math.round(left)
        item.width = Math.round(width)
        item.height = Math.round(height)
        setDrrs([...drrs])
      },
      handleRotate: (rotateAngle: number) => {
        item.rotateAngle = rotateAngle
        setDrrs([...drrs])
      }
    }
    drrs.push(item)
    setDrrs([...drrs])
  }

  return (
    <>
      <Button onClick={() => {
        prev()
      }}>上一页</Button>
      <Button onClick={() => { next() }}>下一页</Button>
      <Button onClick={() => { add() }}>add</Button>

      <hr />

      <Document file="e9.pdf" ref={(ele) => {
        aRef = ele;
      }} >
        <Page pageIndex={pageIndex}
          renderMode="svg"
          // todo, 文本层渲染x方向有偏差
          renderTextLayer={false}>
          {
            drrs && drrs.map((item: DrrData, key) => {
              if (pageIndex == item.pageIndex) {
                return (
                  <Drr
                    key={key}
                    left={item.left}
                    top={item.top}
                    width={item.width}
                    height={item.height}
                    rotateAngle={item.rotateAngle}
                    // aspectRatio={false}
                    minWidth={20}
                    minHeight={20}
                    zoomable='n, w, s, e'
                    // zoomable='n, w, s, e, nw, ne, se, sw'
                    // rotatable={true}
                    onRotate={item.handleRotate}
                    onResize={item.handleResize}
                    onDrag={item.handleDrag}
                  >
                    <img src={item.src} style={{
                      width: item.width,
                      height: item.height,
                      userSelect: "none",
                      pointerEvents: "none"
                    }} />
                  </Drr>
                )
              }
              return (<></>)
            })
          }
        </Page>
      </Document>
    </>
  )
}

export default Index;



