import { Chip } from '@mui/material'
import React from 'react'


interface Props {
    label: string
    isOutlined?: boolean
}

export default function SmallChip(props: Props) {
  return (
    <Chip label={props.label} variant={props.isOutlined ? 'outlined': 'filled'} size="small" color="success" sx={{width: 'auto', height: 14, fontSize: 9, ml: 1}} />
  )
}
