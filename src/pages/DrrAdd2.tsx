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
          f4()
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
          f4()
        },
        handleRotate: (rotateAngle: number) => {
          item.rotateAngle = rotateAngle

          this.setState(state => {
            return { ...state }
          })
          f4()
        }
      }
      drrs.push(item)
      this.setState(state => {
        return { ...state }
      })
      f4()
    }

    const f4 = () => {
      const item: DrrData = drrs[0]
      if (!item) {
        return
      }

      const r = Math.sqrt(Math.pow(item.width / 2, 2) + Math.pow(item.height / 2, 2))
      const rotateAngle = item.rotateAngle
      console.log(`item=>${JSON.stringify(item)}, r=>${r}, `)

      // 以下开始计算四角偏移量
      // 中心点
      const x = item.left + item.width / 2
      const y = item.top + item.height / 2
      // 弧度
      const a = Math.PI / 180 * item.rotateAngle
      // 
      const a4 = Math.atan(item.height / item.width)
      const aa4 = a4 + a
      const dx4 = Math.cos(aa4) * r
      const dy4 = Math.sin(aa4) * r

      // 
      const a3 = Math.atan(item.width / item.height)
      const aa3 = a3 + Math.PI / 2 + a
      const dx3 = Math.cos(aa3) * r
      const dy3 = Math.sin(aa3) * r

      //
      const dx2 = -dx4
      const dy2 = -dy4

      //
      const dx1 = -dx3
      const dy1 = -dy3

      const x4 = Math.round(dx4 + x), x3 = Math.round(dx3 + x), x2 = Math.round(dx2 + x), x1 = Math.round(dx1 + x)
      const y4 = Math.round(dy4 + y), y3 = Math.round(dy3 + y), y2 = Math.round(dy2 + y), y1 = Math.round(dy1 + y)

      console.log(`x=>${x}, y=>${y}, dx4=>${dx4}, dy4=>${dy4}, dx3=>${dx3}, dy3=>${dy3}, dx2=>${dx2}, dy2=>${dy2}, dx1=>${dx1}, dy1=>${dy1}, `)
      console.log(`x4=>${x4}, y4=>${y4}, x3=>${x3}, y3=>${y3}, x2=>${x2}, y2=>${y2}, x1=>${x1}, y1=>${y1}, `)
    }

    return (
      <div>
        <Button onClick={add}>add</Button>
        <Button onClick={f4}>f4</Button>
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



