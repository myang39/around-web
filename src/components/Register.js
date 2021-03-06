import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { API_ROOT } from '../constants';
import {Link} from 'react-router-dom';
const FormItem = Form.Item;

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        fetch(`${API_ROOT}/signup`, {
            method: 'POST',
            body: JSON.stringify({
                username: values.username,
                password: values.password
            })           
        })
        .then((response) => {
          if (response.ok) {
            return response;
          }
          throw new Error(response.statusText);
        })
        .then((response) => {
              message.success("Registration succeed");
              this.props.history.push('/login');
          }
        )
        .catch((err) => message.error("Registration Fail"))
      }
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <Form className="register" onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="Username"
        >
          {
              // getFieldDecorator('...', {}) (<Input />)
              getFieldDecorator('username', {
                rules: [
                    {
                        required: true, message: 'Please input your username!'
                    }
                ],
            })(<Input />)
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Password"
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: 'Please input your password!',
            }, {
              validator: this.validateToNextPassword,
            }],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Confirm Password"
        >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: 'Please confirm your password!',
            }, {
              validator: this.compareToFirstPassword,
            }],
          })(
            <Input type="password" onBlur={this.handleConfirmBlur} />
          )}
        </FormItem>
        
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">Register</Button>
          <p>
            I already an account, go back to <Link to="/login">login</Link>
          </p>
        </FormItem>
      </Form>
    );
  }
}

export const Register = Form.create()(RegistrationForm);

// line 122 
// const Register = func(RegistrationForm)
// func: High order component
//    - input: React Component
//    - output: Another React Component 