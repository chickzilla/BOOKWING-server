const array = Array.from({ length: 8 })
  .map((_, index) => index)
  .filter((_, index) => index % 2 === 0)
  .map((id) => ({ id }));

console.log(array);

const CoinStatus = () => {
  const [coin, isLoading, isError] = useCoin();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }

  return (
    <statusContainer>
      <CoinText>{coin}</CoinText>
      {coin > 0 && <CoinImage />}
    </statusContainer>
  );
};
