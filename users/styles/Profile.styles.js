import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '90%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginVertical: 8,
  },
  readOnlyInput: {
    color: '#888',
    backgroundColor: '#f0f0f0',
  },
  bioInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalImage: {
    width: '90%',
    height: '90%',
    borderRadius: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  noImageText: {
    color: '#fff',
  },
  reasonInput: {
  borderColor: "#ccc",
  borderWidth: 1,
  borderRadius: 8,
  padding: 10,
  fontSize: 16,
  color: "#333",
  backgroundColor: "#FFF",
  marginBottom: 10,
},

});
