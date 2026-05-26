import { useEffect, useState } from "react";
import { currencies, projectStatuses } from "../../utils/constants.js";
import { isPositiveNumber, isRequired } from "../../utils/validators.js";
import Button from "../common/Button.jsx";
import SelectField from "../common/SelectField.jsx";
import TextArea from "../common/TextArea.jsx";
import TextInput from "../common/TextInput.jsx";

const emptyProject = {
  projectName: "",
  clientId: "",
  serviceType: "",
  scope: "",
  price: "",
  currency: "USD",
  startDate: "",
  dueDate: "",
  status: "draft",
};

function ProjectForm({
  clients = [],
  defaultCurrency = "USD",
  initialValues,
  onCancel,
  onSubmit,
  submitLabel = "Save project",
}) {
  const [values, setValues] = useState({
    ...emptyProject,
    currency: defaultCurrency,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues({
      ...emptyProject,
      currency: defaultCurrency,
      ...(initialValues || {}),
      price:
        initialValues?.price === 0 || initialValues?.price
          ? String(initialValues.price)
          : "",
    });
    setErrors({});
  }, [defaultCurrency, initialValues]);

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

    if (!isRequired(values.projectName)) {
      nextErrors.projectName = "Project name is required.";
    }

    if (!isRequired(values.clientId)) {
      nextErrors.clientId = "Select a client.";
    }

    if (!isRequired(values.serviceType)) {
      nextErrors.serviceType = "Service type is required.";
    }

    if (!isRequired(values.price) || !isPositiveNumber(values.price)) {
      nextErrors.price = "Enter a valid price.";
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
      projectName: values.projectName.trim(),
      clientId: values.clientId,
      serviceType: values.serviceType.trim(),
      scope: values.scope.trim(),
      price: Number(values.price),
      currency: values.currency || defaultCurrency,
      startDate: values.startDate,
      dueDate: values.dueDate,
      status: values.status || "draft",
    });
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          error={errors.projectName}
          label="Project name"
          onChange={(event) => updateField("projectName", event.target.value)}
          placeholder="Website redesign"
          value={values.projectName}
        />
        <SelectField
          error={errors.clientId}
          label="Client"
          onChange={(event) => updateField("clientId", event.target.value)}
          value={values.clientId}
        >
          <option value="">Select client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.clientName}
            </option>
          ))}
        </SelectField>
        <TextInput
          error={errors.serviceType}
          label="Service type"
          onChange={(event) => updateField("serviceType", event.target.value)}
          placeholder="Design, consulting, development"
          value={values.serviceType}
        />
        <TextInput
          error={errors.price}
          label="Price"
          min="0"
          onChange={(event) => updateField("price", event.target.value)}
          placeholder="4500"
          step="0.01"
          type="number"
          value={values.price}
        />
        <SelectField
          label="Currency"
          onChange={(event) => updateField("currency", event.target.value)}
          value={values.currency}
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </SelectField>
        <SelectField
          label="Status"
          onChange={(event) => updateField("status", event.target.value)}
          value={values.status}
        >
          {projectStatuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </SelectField>
        <TextInput
          label="Start date"
          onChange={(event) => updateField("startDate", event.target.value)}
          type="date"
          value={values.startDate}
        />
        <TextInput
          label="Due date"
          onChange={(event) => updateField("dueDate", event.target.value)}
          type="date"
          value={values.dueDate}
        />
      </div>
      <TextArea
        label="Scope"
        onChange={(event) => updateField("scope", event.target.value)}
        placeholder="Summarize the agreed project scope"
        rows={5}
        value={values.scope}
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

export default ProjectForm;
