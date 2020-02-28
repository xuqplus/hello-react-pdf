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

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drrs: [],
      pageIndex: 0
    };
  }

  render() {
    const { drrs, pageIndex } = this.state
    let aRef = null

    const prev = () => {
      const { pageIndex } = this.state
      let i = pageIndex - 1
      if (i < 0) {
        i = 0
      }
      this.setState(state => {
        return {
          ...state, pageIndex: i
        }
      })
      console.log(aRef.pages[0].firstChild.style.width)
      console.log(aRef.pages[0].firstChild.style.height)
    }

    const next = () => {
      const { pageIndex } = this.state
      let i = pageIndex + 1
      if (aRef && i >= aRef.pages.length) { // ref, 不超出最后一页
        i = aRef.pages.length - 1
      }
      this.setState(state => {
        return {
          ...state, pageIndex: i
        }
      })
      console.log(aRef.pages[0])
    }

    const add = () => {
      let left = 0, top = 0
      if (drrs && drrs.length > 0) {
        left = drrs[drrs.length - 1].left + 24
        top = drrs[drrs.length - 1].top + 24
      }

      const item: DrrData = {
        src: 'favicon.png',
        left: left,
        top: top,
        width: 64,
        height: 64,
        rotateAngle: 0,
        pageIndex: pageIndex,
        handleDrag: (deltaX: number, deltaY: number) => {
          item.top += deltaY
          item.left += deltaX
          this.setState(state => {
            return { ...state }
          })
        },
        handleResize: (style, isShiftKey, type) => {
          let { top, left, width, height } = style
          item.top = Math.round(top)
          item.left = Math.round(left)
          item.width = Math.round(width)
          item.height = Math.round(height)
          this.setState(state => {
            return { ...state }
          })
        },
        handleRotate: (rotateAngle: number) => {
          item.rotateAngle = rotateAngle
          this.setState(state => {
            return { ...state }
          })
        }
      }
      drrs.push(item)
      this.setState(state => {
        return { ...state }
      })
    }
    return (
      <>
        <Button onClick={prev}>上一页</Button>
        <Button onClick={next}>下一页</Button>
        <Button onClick={add}>add</Button>

        <hr />

        <Document file="e9.pdf" ref={ele => aRef = ele}>
          <Page pageIndex={pageIndex}
            renderMode="svg"
            // todo, 文本层渲染x方向有偏差
            renderTextLayer={false}>
            {
              drrs && drrs.map((item: DrrData, key) => {
                if (pageIndex == item.pageIndex) {
                  return (
                    <Drr
                      key={`show-${key}`}
                      left={item.left}
                      top={item.top}
                      width={item.width}
                      height={item.height}
                      rotateAngle={item.rotateAngle}
                      // aspectRatio={false}
                      // zoomable='n, w, s, e'
                      zoomable='n, w, s, e, nw, ne, se, sw'
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
                return (<div key={`not-show-${key}`}></div>)
              })
            }
          </Page>
        </Document>
      </>
    )
  }
}

export default Index;



