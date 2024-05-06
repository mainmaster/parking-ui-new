import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal as CustomModal } from 'react-bootstrap';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
// Components
import Modal from 'components/Modal';
import Input from 'components/Input';
import { useUpdateRenterMutation } from '../../api/renters/renters.api';

const EditRenterModal = ({ show, handleClose }) => {
  const { renter } = useSelector((state) => state.renters.editRenter);
  const formikRef = useRef();
  const dispatch = useDispatch();

  const [updateRenter] = useUpdateRenterMutation();

  const onSubmit = (values) => {
    handleClose();
    dispatch(
      updateRenter({
        ...renter,
        company_name: values.company_name,
        contacts: values.contacts
      })
    );
  };

  useEffect(() => {
    if (show && formikRef.current) {
      formikRef.current.setFieldValue('contacts', renter.contacts);
      formikRef.current.setFieldValue('company_name', renter.company_name);
    }
  }, [renter, show]);

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      header={<CustomModal.Title>Редактировать арендатора</CustomModal.Title>}
      body={
        <Formik
          innerRef={formikRef}
          onSubmit={onSubmit}
          initialValues={{}}
          validationSchema={null}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} id="edit-application">
              <Input
                label="Контакты"
                name="contacts"
                type="text"
                onChange={(e) =>
                  props.setFieldValue('contacts', e.target.value)
                }
              />
              <Input
                label="Арендатор"
                name="company_name"
                type="text"
                onChange={(e) =>
                  props.setFieldValue('company_name', e.target.value)
                }
              />
            </form>
          )}
        </Formik>
      }
      footer={
        <Button type="submit" form="edit-application">
          Изменить
        </Button>
      }
    />
  );
};

EditRenterModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func
};

export default EditRenterModal;
