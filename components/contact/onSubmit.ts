const onSubmit = async (
  values: any
): Promise<
  | {
      status: number;
      message: string;
    }
  | undefined
> => {
  const response = await fetch("/api/send", {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const status = response?.status;

  if (status === 200) return undefined;

  return { status, message: await response?.text() };
};

export default onSubmit;
