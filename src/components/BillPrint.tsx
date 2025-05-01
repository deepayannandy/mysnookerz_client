'use client'

import { StoreDataType } from '@/types/adminTypes'
import React from 'react'

// React Imports
export type BillPrintDataType = {
  tableName?: string
  billNo: string
  server: string
  orderData: {
    name: string
    category: string
    amount: number
  }[]
  subTotal: number
  tax: number
  discount?: string | number
  total: string
}

type BillPrintProps = {
  data: BillPrintDataType
  storeData: StoreDataType
  style?: React.CSSProperties
  getTableData?: () => void
}

const BillPrint = ({ data, storeData, style }: BillPrintProps) => {
  return (
    <div
      style={{
        fontFamily: 'sans-serif',
        fontSize: '16px',
        lineHeight: '1.5',
        padding: '20px',
        boxSizing: 'border-box',
        ...style
      }}
    >
      <div style={{ width: '100%', borderCollapse: 'collapse' }}>
        <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '20px' }}>
          {storeData.StoreData?.storeName ?? ''}
        </div>
        <div style={{ textAlign: 'center' }}>{storeData.StoreData?.address ?? ''}</div>
        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <span style={{ fontWeight: '600', marginRight: '4px' }}>Contact:</span>
          {`+91 ${storeData.StoreData?.contact ?? ''}`}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          <div>
            {data.tableName ? (
              <>
                <span style={{ fontWeight: 'bold', marginRight: '4px' }}>Table No:</span>
                {data.tableName}
              </>
            ) : null}
          </div>
          <div>
            <span style={{ fontWeight: 'bold', marginRight: '4px' }}>Bill No.:</span>
            {data.billNo}
          </div>
        </div>

        <div style={{ display: 'flex', marginTop: '8px' }}>
          <span style={{ fontWeight: 'bold', marginRight: '4px' }}>Server:</span>
          {data.server}
        </div>

        <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '20px', marginTop: '16px' }}>INVOICE</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div
            style={{
              textAlign: 'left',
              fontWeight: 'bold',
              backgroundColor: '#8C57FF',
              paddingRight: '0.5rem',
              paddingLeft: '0.5rem',
              marginBottom: '0.5rem'
            }}
          >
            Item Name
          </div>
          <div
            style={{
              textAlign: 'right',
              fontWeight: 'bold',
              backgroundColor: '#8C57FF',
              paddingRight: '0.5rem',
              paddingLeft: '0.5rem',
              marginBottom: '0.5rem'
            }}
          >
            Amount
          </div>
          {data.orderData?.map((item, index) => (
            <React.Fragment key={index}>
              <div
                style={{
                  fontWeight: 'bold',
                  textAlign: 'left',
                  paddingRight: '0.5rem',
                  paddingLeft: '0.5rem',
                  marginBottom: '0.5rem',
                  borderBottom: '1px solid #ccc'
                }}
              >
                {item.name} <br />
                <span style={{ fontWeight: 'normal', fontStyle: 'italic' }}>{item.category}</span>
              </div>
              <div
                style={{
                  textAlign: 'right',
                  paddingRight: '0.5rem',
                  paddingLeft: '0.5rem',
                  marginBottom: '0.5rem',
                  borderBottom: '1px solid #ccc'
                }}
              >
                {item.amount}
              </div>
            </React.Fragment>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <div>
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', textAlign: 'right', paddingRight: '0.5rem' }}
            >
              <span>Sub Total:</span> {data.subTotal?.toFixed(2)}
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', textAlign: 'right', paddingRight: '0.5rem' }}
            >
              <span>Tax:</span> {data.tax?.toFixed(2)}
            </div>
            {data.discount && (
              <div
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', textAlign: 'right', paddingRight: '0.5rem' }}
              >
                <span>Discount:</span> {data.discount}
              </div>
            )}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                textAlign: 'right',
                paddingRight: '0.5rem',
                paddingLeft: '0.5rem',
                borderTop: '1px solid #ccc'
              }}
            >
              <span>Grand Total:</span> {data.total}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>Thank You! Visit Again</div>
      </div>
    </div>
  )
}

export default BillPrint
