import Container from "@mui/material/Container";

type Props = { children: React.ReactNode };

function BodyWrapper(props: Props) {
  return <Container maxWidth="md">{props.children}</Container>;
}

export default BodyWrapper;
