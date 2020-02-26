import React, { useState } from 'react';
import styles from './Welcome.less';
import { Document, Page } from 'react-pdf';
import { Button } from 'antd';

export interface Pageable {
  pageNumber: number;
}

const Index: React.FC<Pageable> = props => { 

  const [ pageable, setPageable ] = useState({
    pageNumber: props.pageNumber || 1
  })

  const prev = () => {
    let i = pageable.pageNumber - 1
    if (i < 1) {
      i = 1
    }
    setPageable({pageNumber: i})
  }

  const next = () => {
    setPageable({
      pageNumber: pageable.pageNumber + 1
    })
  }

  return (
  <>
    <Button onClick={() => {
      prev()
    }}>上一页</Button>
    <Button onClick={() => { next() }}>下一页</Button>

    <Document file="e9.pdf">
      <Page pageNumber={ pageable.pageNumber } />
    </Document>
  </>
  ) 
}

export default Index;



