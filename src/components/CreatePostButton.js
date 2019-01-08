import React from 'react';
import {Modal, Button, message} from 'antd';
import {CreatePostForm} from "./CreatePostForm"
import {API_ROOT, TOKEN_KEY, AUTH_HEADER, POS_KEY, LOC_SHAKE} from "../constants"

export class CreatePostButton extends React.Component {
  state = {
    ModalText: 'Content of the modal',
    visible: false,
    confirmLoading: false,
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = () => {
    this.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.setState({
          confirmLoading: true,
        });

        const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
        const token = localStorage.getItem(TOKEN_KEY);
        let formData = new FormData();
        formData.set('lat', lat + 2 * LOC_SHAKE * Math.random() - LOC_SHAKE );
        formData.set('lon', lon + 2 * LOC_SHAKE * Math.random() - LOC_SHAKE );
        /*
        *
        *
        *
        * */
        formData.set('message', values.message);
        formData.set('image', values.image[0].originFileObj);

        fetch(`${API_ROOT}/post`, {
          method: 'POST',
          body: formData, //formData
          headers: {
            Authorization: `${AUTH_HEADER} ${token}`,
          }
      })
          .then((response) => {
            if (response.ok) {
              this.setState({
                confirmLoading: false,
                visible: false
              });
              return true;
            }
            throw new Error(response.statusText);
          }).then((response) => {
              message.success("Post Created successfully");
              this.form.resetFields();
              this.props.loadNearbyPosts();
          }).catch((err) => {
            message.error("Failed to create the post.");
            this.setState({
              confirmLoading: false
            });
          });
      }
    });
  }

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  }

  getFormRef = (formInstance) => {
    this.form = formInstance;
  }

  render() {
    const { visible, confirmLoading} = this.state;
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          Create New Post
        </Button>
        <Modal
          title="Create New Post"
          visible={visible}
          onOk={this.handleOk}
          okText="Create"
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <CreatePostForm ref={this.getFormRef}/>
        </Modal>
      </div>
    );
  }
}