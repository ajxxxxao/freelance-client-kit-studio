import { useEffect, useState } from "react";
import { isRequired, isValidEmail } from "../../utils/validators.js";
import Button from "../common/Button.jsx";
import TextArea from "../common/TextArea.jsx";
import TextInput from "../common/TextInput.jsx";

const emptyClient = {
  clientName: "",
  companyName: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
};

function ClientForm({ initialValues, onCancel, onSubmit, submitLabel = "Save client" }) {
  const [values, setValues] = useState(emptyClient);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues({
      ...emptyClient,
      ...(initialValues || {}),
    });
    setErrors({});
  }, [initialValues]);

  function updateField(field, value) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: "",
    }));
  }

  function validate() {
    const nextErrors = {};

    if (!isRequired(values.clientName)) {
      nextErrors.clientName = "Client name is required.";
    }

    if (!isValidEmail(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      ...(initialValues || {}),
      clientName: values.clientName.trim(),
      companyName: values.companyName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      notes: values.notes.trim(),
    });
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          error={errors.clientName}
          label="Client name"
          onChange={(event) => updateField("clientName", event.target.value)}
          placeholder="Jane Cooper"
          value={values.clientName}
        />
        <TextInput
          label="Company name"
          onChange={(event) => updateField("companyName", event.target.value)}
          placeholder="Cooper Studio"
          value={values.companyName}
        />
        <TextInput
          error={errors.email}
          label="Email"
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="jane@example.com"
          type="email"
          value={values.email}
        />
        <TextInput
          label="Phone"
          onChange={(event) => updateField("phone", event.target.value)}
          placeholder="+1 555 0188"
          value={values.phone}
        />
      </div>
      <TextInput
        label="Address"
        onChange={(event) => updateField("address", event.target.value)}
        placeholder="Business address"
        value={values.address}
      />
      <TextArea
        label="Notes"
        onChange={(event) => updateField("notes", event.target.value)}
        placeholder="Context, preferences, and relationship notes"
        value={values.notes}
      />
      <div className="flex justify-end gap-3">
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

export default ClientForm;
