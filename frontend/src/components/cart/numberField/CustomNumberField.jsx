import { NumberField } from '@base-ui-components/react/number-field';
import { CursorGrowIcon } from './CursorGrowIcon';
import { MinusIcon } from './MinusIcon';
import { PlusIcon } from './PlusIcon';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const CustomNumberField = ({ value, onChangeFunc, cartItemId }) => {

  const showAlertCartItemIdList = useSelector((state) => state.cart.showAlertCartItemIdList)


  return (
    <div>
      <div className="h-10 flex flex-row">
        <div className="w-10 border bg-buttonMain border-buttonMain flex items-center justify-center  cursor-pointer text-white"
          onClick={() => onChangeFunc({ cartItemId, value: value - 1 })}>
          <MinusIcon />
        </div>

        <div className="w-13 border-t border-b border-buttonMain flex items-center justify-center text-md">
          {value}
        </div>

        <div className="w-10 border border-buttonMain bg-buttonMain flex items-center justify-center text-white cursor-pointer"
          onClick={() => onChangeFunc({ cartItemId, value: value + 1 })}>
          <PlusIcon />
        </div>
      </div>
      {showAlertCartItemIdList.includes(cartItemId) && <div className="text-sm font-bold">Reach Stock Limit</div>}

    </div>
  )
}

