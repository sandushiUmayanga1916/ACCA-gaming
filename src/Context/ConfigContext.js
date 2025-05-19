import React, { createContext } from 'react'
import Config from '../Config'

export const ConfigContext = createContext()

export const ConfigProvider = props => {
    return (
        <ConfigContext.Provider value={Config}>
            {props.children}
        </ConfigContext.Provider>
    )
}
