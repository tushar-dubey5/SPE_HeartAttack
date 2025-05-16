package com.hospital.service;

import org.springframework.stereotype.Service;
import org.python.core.PyObject;
import org.python.util.PythonInterpreter;
import org.springframework.core.io.ClassPathResource;
import java.io.InputStream;
import java.util.Map;

@Service
public class HeartAttackPredictionService {
    private final PythonInterpreter pythonInterpreter;
    private PyObject pickledModel;

    public HeartAttackPredictionService() {
        pythonInterpreter = new PythonInterpreter();
        loadModel();
    }

    private void loadModel() {
        try {
            // Load the pickled model
            InputStream modelStream = new ClassPathResource("models/regmodel.pkl").getInputStream();
            pythonInterpreter.exec("import pickle");
            pythonInterpreter.set("model_data", modelStream.readAllBytes());
            pythonInterpreter.exec("model = pickle.loads(model_data)");
            pickledModel = pythonInterpreter.get("model");
        } catch (Exception e) {
            throw new RuntimeException("Failed to load the prediction model", e);
        }
    }

    public double predictHeartAttackRisk(Map<String, Object> features) {
        try {
            // Convert features to Python list
            pythonInterpreter.set("features", features);
            pythonInterpreter.exec("prediction = model.predict([list(features.values())])[0]");
            PyObject result = pythonInterpreter.get("prediction");
            return (double) result.__tojava__(Double.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to make prediction", e);
        }
    }
} 