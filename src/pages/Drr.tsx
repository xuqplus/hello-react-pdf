import React, { useState } from 'react';
import styles from './Welcome.less';
import { Document, Page } from 'react-pdf';
import { Button } from 'antd';
import Drr from '../components/DragResizeRotate';

export interface Pageable {
  top: number;
  left: number;
  width: number;
  height: number;
  rotateAngle: number;
}

const Index: React.FC = props => {

  const [drr, setDrr] = useState({
    top: 0,
    left: 0,
    width: 200,
    height: 200,
    rotateAngle: 0
  })

  const [pageIndex, setPageIndex] = useState(0)

  const handleResize = (style, isShiftKey, type) => {
    // type is a string and it shows which resize-handler you clicked
    // e.g. if you clicked top-right handler, then type is 'tr'
    let { top, left, width, height } = style
    top = Math.round(top)
    left = Math.round(left)
    width = Math.round(width)
    height = Math.round(height)
    setDrr({ ...drr, top, left, width, height })

    console.log(`drr=>${JSON.stringify(drr)}`)
  }

  const handleRotate = (rotateAngle: number) => {
    setDrr({ ...drr, rotateAngle })

    console.log(`drr=>${JSON.stringify(drr)}`)
  }

  const handleDrag = (deltaX: number, deltaY: number) => {
    setDrr({ ...drr, top: drr.top + deltaY, left: drr.left + deltaX })

    console.log(`drr=>${JSON.stringify(drr)}`)
  }

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

  let aRef = React.createRef();

  return (
    <>
      <Button onClick={() => {
        prev()
      }}>上一页</Button>
      <Button onClick={() => { next() }}>下一页</Button>

      <hr />

      <Document file="e9.pdf" ref={(ele) => {
        aRef = ele;
      }} >
        <Page pageIndex={pageIndex}
          renderMode="svg"
          // todo, 文本层渲染x方向有偏差
          renderTextLayer={false}>
          <Drr left={drr.left}
            top={drr.top}
            width={drr.width}
            height={drr.height}
            rotateAngle={drr.rotateAngle}
            // aspectRatio={false}
            // minWidth={10}
            // minHeight={10}
            zoomable='n, w, s, e'
            // zoomable='n, w, s, e, nw, ne, se, sw'
            // rotatable={true}
            onRotate={handleRotate}
            // onRotateStart={this.handleRotateStart}
            // onRotateEnd={this.handleRotateEnd}
            onResize={handleResize}
            // onResizeStart={this.handleResizeStart}
            // onResizeEnd={this.handleUp}
            onDrag={handleDrag}
          // onDragStart={this.handleDragStart}
          // onDragEnd={this.handleDragEnd}
          >
            <img src="favicon.png" style={{
              width: drr.width,
              height: drr.height,
              userSelect: "none",
              pointerEvents: "none"
            }} />
          </Drr>
        </Page>
      </Document>
    </>
  )
}

export default Index;



