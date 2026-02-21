import React, { useState } from 'react'
import styled from 'styled-components';
import AddIcon from '@mui/icons-material/Add';
import axios from '../axiosInstance';
import { CreteProduct } from '../Api';
import { useNotification } from '../NotificationContext';


const Admin = () => {
  const showNotification = useNotification();
  const [State, setState] = useState({
    ProductName: '',
    Description: '',
    ProductImage: '',
    Qty: 0,
    ProductPrice: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevstate) => ({
      ...prevstate,
      [name]: value
    }))
  }
  const handleClear = () => {
    setState({
      ProductName: '',
      Description: '',
      ProductImage: '',
      Qty: 0,
      ProductPrice: 0,
    })
  }

  const AddProduct = async () => {
    try {
      const response = await axios.post(CreteProduct, {
        ProductName: State.ProductName,
        Description: State.Description,
        ProductImage: State.ProductImage,
        Qty: State.Qty,
        Rate: State.ProductPrice
      })
      if (response.data.Status === 6000) {
        showNotification("Product added successfully!", "success");
        handleClear();
      } else {
        showNotification("Error: " + response.data.data, "error");
      }
    } catch (error) {
      console.log('Create Product Api Error', error);
      if (error.response && error.response.status === 401) {
        showNotification("Session expired or invalid. Please login again.", "error");
      } else {
        showNotification("Failed to add product.", "error");
      }
    }
  }


  return (
    <>
      <StyledHeading>Hi, Welcome back 👋</StyledHeading>
      <MainDIv>
        <SubDIv>
          <SubHeading>Categories</SubHeading>
          <TxtHeading>Products</TxtHeading>
        </SubDIv>
        <SubDIv>
          <SubHeading>Items</SubHeading>
          <TxtHeading>Shoe</TxtHeading>
          <TxtHeading>Bag</TxtHeading>
          <TxtHeading>Camera</TxtHeading>
        </SubDIv>
        <SubDIv>
          <TxtHeading>Name</TxtHeading>
          <InputBox name='ProductName' value={State.ProductName} onChange={handleChange} />
          <TxtHeading>Description </TxtHeading>
          <InputBox name='Description' value={State.Description} onChange={handleChange} />
          <TxtHeading>Image</TxtHeading>
          <FileInput name='ProductImage' onChange={handleChange} />
          <TxtHeading>Qty</TxtHeading>
          <InputBox name='Qty' value={State.Qty} onChange={handleChange} />
          <TxtHeading>Rate</TxtHeading>
          <InputBox name='ProductPrice' value={State.ProductPrice} onChange={handleChange} />
          <SubmitBox
            onClick={AddProduct}
          >Add Product</SubmitBox>
          <AddIcon
            sx={{
              color: 'blue',
              float: 'right',
              fontSize: '35px',
              margin: '18px',
            }}
            onClick={handleClear}
          />
        </SubDIv>

      </MainDIv>

    </>
  )
}

export default Admin

const MainDIv = styled.div`
  background-color: gray;
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const SubDIv = styled.div`
  width: 100%;

`

const TxtHeading = styled.p`
  font-size : 17px;
  margin : 4px ;
  padding :4px;
  &&:hover {
    background-color :red;
  }
`
const SubHeading = styled.p`
  color : blue;
  font-size : 19px;
  font-weight : bold;
  margin : 10px;
`

const StyledHeading = styled.p`
  color : blue;
  font-size : 20px;
  font-weight : bold;
  text-align : center;
  margin : 10px;
`
const InputBox = styled.input`
padding :6px;
fontfamily :san-serif;
`

const SubmitBox = styled.div`
  background-color : blue;
  width :100px; 
  padding :10px;
  border-radius: 4px;
  margin-top : 12px;
  text-align : center;
  font-size : 12px;
  color : white;
  fontfamily :san-serif;
  cursor : pointer;
`
const FileInput = styled.input.attrs({
  type: 'file',
  accept: 'image/*'
})`
  border-radius: 4px;
  font-size: 15px;
  fontfamily :san-serif;

`;