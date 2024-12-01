const AdminPaymentApproval = ({ payments }) => {
  const handleApproval = (paymentId, status) => {
    // Update the payment status in your backend (e.g., Firestore)
    console.log(`Payment ${paymentId} is marked as ${status}`);
  };

  return (
    <View>
      {payments.map((payment) => (
        <View key={payment.id}>
          <Text>Ref ID: {payment.refId}</Text>
          <Image source={{ uri: payment.receiptImage }} style={{ width: 100, height: 100 }} />
          <Button title="Approve" onPress={() => handleApproval(payment.id, "Approved")} />
          <Button title="Reject" onPress={() => handleApproval(payment.id, "Rejected")} />
        </View>
      ))}
    </View>
  );
};
