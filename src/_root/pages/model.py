import tensorflow as tf
import tensorflowjs as tfjs

# Load your existing model
model = tf.keras.models.load_model('public/models/asl_model.h5')

# Create a new model with explicit input shape
input_shape = (1, 224, 224, 3)  # Batch size, height, width, channels
inputs = tf.keras.Input(shape=input_shape[1:])  # Remove batch size dimension
outputs = model(inputs)
new_model = tf.keras.Model(inputs, outputs)

# Convert and save the model
tfjs.converters.save_keras_model(
    new_model, 
    'public/models/asl_model'
)

print("Model converted successfully!")