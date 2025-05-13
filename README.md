This is a [Next.js](https://nextjs.org) project bootstrapped with [
`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically
optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions
are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use
the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for
more details.

# Main Business flow

# Dynamic Form Builder for Next.js with Shadcn UI

A highly customizable, type-safe dynamic form builder for Next.js applications, built with Shadcn UI components, React Hook Form, and Zod validation.

## ✨ Features

- 🏗️ **Schema-driven forms** – Define forms using a simple JSON schema
- 🛡️ **Type-safe validation** – Automatic Zod schema generation with comprehensive validation
- 📱 **Responsive layout** – Built-in responsive grid system
- 🎨 **Shadcn UI integration** – Beautiful, accessible form components out of the box
- 🔌 **Extensible field types** – Supports multiple input types:
  - Text, Number, Email inputs
  - Select dropdowns
  - Checkboxes and Radio buttons
  - Date pickers
  - Textareas
  - Rich text editors (WYSIWYG)
  - Multi-select fields
- ⚡ **Performance optimized** – Client-side only rendering with `"use client"`
- 🔄 **Conditional logic** – Field visibility based on other fields' values
- 📦 **Modular architecture** – Easy to extend with custom field types

## 🚀 Usage

```tsx
import { DynamicForm } from "./components/dynamic-form";

const formFields = [
  {
    name: "email",
    type: "email",
    label: "Email Address",
    validationRules: {
      required: true,
    },
  },
  // ... more fields
];

function onSubmit(data) {
  console.log("Form submitted:", data);
}

<DynamicForm fields={formFields} onSubmit={onSubmit} submitText="Register" />;
```

## 📦 Installation

1. Install dependencies:

```bash
npm install react-hook-form @hookform/resolvers zod
```

2. Ensure you have [Shadcn UI](https://ui.shadcn.com/) components set up in your Next.js project.

## 💡 Why Use This?

- **Rapid development** – Build complex forms in minutes
- **Consistent UX** – Leverages Shadcn's beautifully designed components
- **Type safety** – End-to-end TypeScript support
- **Validation made easy** – Automatic validation from field definitions
- **Perfect for CRUD apps** – Great for admin panels and data-intensive applications

## 🛣️ Roadmap

- [ ] Add file upload support
- [ ] Improve conditional logic system
- [ ] Add form steps / multi-page forms
- [ ] Enhance accessibility
- [ ] Theme customization options

## 🤝 Contribution

Contributions are welcome! If you'd like to add a feature or fix a bug, please [open an issue](https://github.com/your-repo/issues) first to discuss your idea. Then fork the repository and submit a PR.

---

Built with ❤️ using Next.js, Shadcn UI, and React Hook Form.

# Dynamic Select Field Component

This component provides a flexible select/dropdown input that supports both static (hardcoded) options and dynamic (
API-loaded) options with URL parameter integration.

---

## ✨ Features

- ✅ **Dual Mode Support**: Works with both static options and API-loaded options
- 🔗 **URL Parameter Integration**: Automatically loads data based on URL params
- ↔️ **Dependent Selects**: Options can depend on other field values
- 🏷️ **Flexible Option Formats**: Supports arrays, value-label objects, and complex objects
- ⚡ **Loading States**: Built-in loading indicators for async operations
- 🛡️ **Type Safe**: Full TypeScript support

---

## 📦 Installation

```bash
npm install @your-project/select-field
```

---

## 🚀 Usage

### ✅ Basic Static Options

```ts
{
    name: 'color',
        type
:
    'select',
        label
:
    'Favorite Color',
        option
:
    {
        options: ['Red', 'Green', 'Blue'] // Simple string array
    }
}
```

### 🏷️ Value-Label Objects

```ts
{
    name: 'notification_preference',
        type
:
    'select',
        label
:
    'Notification Preference',
        option
:
    {
        options: [
            {value: 'email', label: 'Email'},
            {value: 'sms', label: 'Text Message'}
        ]
    }
}
```

### 🌐 API-Loaded Options

```ts
{
    name: 'country',
        type
:
    'select',
        label
:
    'Country',
        option
:
    {
        apiUrl: '/api/countries',
            optionLabel
    :
        'name',
            optionValue
    :
        'code'
    }
}
```

### 🔄 Dependent Selects

```ts
{
    name: 'city',
        type
:
    'select',
        label
:
    'City',
        option
:
    {
        apiUrl: '/api/cities',
            urlParamMap
    :
        {
            countryCode: 'country' // Watches 'country' field value
        }
    ,
        optionLabel: 'name',
            optionValue
    :
        'id'
    }
}
```

---

## ⚙️ Configuration Options

### Common Properties

| Property       | Type       | Description                             |
| -------------- | ---------- | --------------------------------------- |
| `options`      | `Option[]` | Static array of options                 |
| `optionLabel`  | `string`   | Key for option display text             |
| `optionValue`  | `string`   | Key for option value                    |
| `filter`       | `boolean`  | Enable search/filter functionality      |
| `emptyMessage` | `string`   | Message shown when no options available |

### API-Loaded Options

| Property            | Type                      | Description                        |
| ------------------- | ------------------------- | ---------------------------------- |
| `apiUrl`            | `string`                  | Endpoint to fetch options from     |
| `urlParamMap`       | `Record<string, string>`  | Maps URL params to API params      |
| `queryParams`       | `Record<string, string>`  | Additional static query params     |
| `transformResponse` | `(data: any) => Option[]` | Function to transform API response |

---

## 🧩 Option Formats

### 1. Simple Array

```ts
options: ["Option 1", "Option 2"];
// Values and labels will be the same
```

### 2. Value-Label Objects

```ts
options: [
  { value: "opt1", label: "Option 1" },
  { value: "opt2", label: "Option 2" },
];
```

### 3. Complex Objects

```ts
options: [
    {id: 1, name: 'User 1', email: 'user1@example.com'},
    {id: 2, name: 'User 2', email: 'user2@example.com'}
],
    optionLabel
:
'name',
    optionValue
:
'id'
```

---

## 🧪 Examples

### Complete Form Example

```ts
const formFields: FormField[] = [
  {
    name: "user_type",
    type: "select",
    label: "User Type",
    option: {
      options: [
        { id: 1, name: "Admin", role: "administrator" },
        { id: 2, name: "Editor", role: "content_editor" },
      ],
      optionLabel: "name",
      optionValue: "id",
    },
  },
  {
    name: "country",
    type: "select",
    label: "Country",
    option: {
      apiUrl: "/api/countries",
      optionLabel: "name",
      optionValue: "code",
      emptyMessage: "Loading countries...",
    },
  },
  {
    name: "city",
    type: "select",
    label: "City",
    option: {
      apiUrl: "/api/cities",
      urlParamMap: { countryCode: "country" },
      optionLabel: "name",
      optionValue: "id",
      emptyMessage: "Select country first",
    },
  },
];
```

### Custom Transform Example

```ts
{
    name: 'products',
        type
:
    'select',
        label
:
    'Products',
        option
:
    {
        apiUrl: '/api/inventory',
            transformResponse
    :
        (data) =>
            data.items.map(item => ({
                label: `${item.name} (${item.stock} available)`,
                value: item.sku
            })),
            optionLabel
    :
        'label',
            optionValue
    :
        'value'
    }
}
```

---

## ✅ Best Practices

- Use **static options** for small, unchanging lists (<10 items)
- Use **API-loaded options** for:
  - Large lists
  - Frequently changing data
  - Dependent selections
- Always provide `emptyMessage` for better UX
- Use `transformResponse` to normalize API response
- Memoize options when using complex objects

---

## 🛠️ Troubleshooting

### ❌ Options not loading

- ✅ Check API endpoint
- ✅ Ensure URL parameters are passed correctly
- ✅ Inspect network tab in dev tools

### ❌ Wrong values being saved

- ✅ Verify `optionValue` is set correctly
- ✅ Ensure `transformResponse` returns correct structure

### ❌ Dependent selects not updating

- ✅ Check `urlParamMap` keys match parent field names
- ✅ Ensure parent field uses correct `optionValue`

---

## 📄 License

MIT
