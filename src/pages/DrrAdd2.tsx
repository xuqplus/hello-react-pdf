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
      drrs: []
    };
  }

  render() {
    const { drrs } = this.state

    const add = () => {
      let left = 0
      let top = 0
      const lastetItem = drrs[drrs.length - 1]
      if (lastetItem && null != lastetItem.left) {
        left = lastetItem.left + 20
      }
      if (lastetItem && null != lastetItem.top) {
        top = lastetItem.top + 20
      }

      const item: DrrData = {
        src: 'favicon.png',
        left: left,
        top: top,
        width: 64,
        height: 64,
        rotateAngle: 0,
        pageIndex: 0,
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
        console.log(state)
        return { ...state }
      })
    }

    return (
      <div>
        <Button onClick={add}>add</Button>
        <hr />
        <div style={{ display: 'block', position: 'relative' }}>
          {
            drrs && drrs.map((item: DrrData, key) => {
              if (true) {
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
        </div>
      </div>
    )
  }
}

export default Index;



