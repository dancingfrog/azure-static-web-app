if (!require("reticulate")) {
  install.packages("reticulate")
  library("reticulate")
}

reticulate::source_python("src/start-jupyter.py")
