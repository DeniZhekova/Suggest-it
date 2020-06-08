import React, { Component } from "react";
import { singleSuggestion, update } from "./apiSuggest";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
import Logo from "../core/Logo.png";
import CKEditor from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

class EditSuggestion extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      title: "",
      body: "",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      loading: false
    };
  }

  init = suggestId => {
    singleSuggestion(suggestId).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data.postedBy._id,
          title: data.title,
          body: data.body,
          error: ""
        });
      }
    });
  };

  componentDidMount() {
    this.suggestData = new FormData();
    const suggestId = this.props.match.params.suggestId;
    this.init(suggestId);
  }

  isValid = () => {
    const { title, body, fileSize } = this.state;
    if (fileSize > 1000000) {
      this.setState({
        error: "File size should be less than 100kb",
        loading: false
      });
      return false;
    }
    if (title.length === 0 || body.length === 0) {
      this.setState({ error: "All fields are required", loading: false });
      return false;
    }
    return true;
  };

  handleChange = name => event => {
    this.setState({ error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;

    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.suggestData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });
    console.log(this.state);
    if (this.isValid()) {
      const suggestId = this.props.match.params.suggestId;
      const token = isAuthenticated().token;

      update(suggestId, token, this.suggestData).then(data => {
        if (data.error) {
          this.setState({ error: data.error, loading: false });
        } else {
          this.setState({
            loading: false,
            redirect: "true",
            title: "",
            body: "",
            photo: "",
            error: ""
          });
        }
      });
    }
  };

  editSuggestForm = (title, body) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Suggestion Photo</label>
        <input
          onChange={this.handleChange("photo")}
          type="file"
          accept="image/*"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Title</label>
        <input
          onChange={this.handleChange("title")}
          type="text"
          className="form-control"
          value={title}
        />
      </div>
      <div className="md-form">
        <CKEditor
          style={{ height: "100px" }}
          onInit={editor => {
            console.log("Editor is ready to use!", editor);
            // Insert the toolbar before the editable area.
            editor.ui
              .getEditableElement()
              .parentElement.insertBefore(
                editor.ui.view.toolbar.element,
                editor.ui.getEditableElement()
              );
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            this.suggestData.set("body", data);
            this.setState({ body: data });
          }}
          editor={DecoupledEditor}
          data={body}
        />
      </div>
      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
        Update Suggestion
      </button>
    </form>
  );

  render() {
    const { id, title, body, redirectToProfile, error, loading } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
    }

    return (
      <div className="container">
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        {loading ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          ""
        )}

        <img
          style={{ height: "200px", width: "auto" }}
          className="img-thumbnail"
          src={`/api/suggest/photo/${this.props.match.params.suggestId}`}
          onError={i => (i.target.src = `${Logo}`)}
          alt={title}
        />
        {isAuthenticated().user._id === id && this.editSuggestForm(title, body)}
      </div>
    );
  }
}

export default EditSuggestion;