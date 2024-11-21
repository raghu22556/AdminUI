import React from 'react';
import AttachmentIcon from '@material-ui/icons/Attachment';

export class ImageUpload extends React.Component {
  state = { file: '' };
  render() {
    let { name, value, item } = this.props;

    const isUrl = typeof value == 'string';
    let url;
    if (typeof value == 'object' && value) {
      url = window.URL.createObjectURL(value);
    } else {
      url = value;
    }
    // if (value == '0.png' || value == null) {
    //   value = '/imageNotFound.png';
    // }
    const uploadButton = (
      <div>
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <p style={{ fontSize: '16px', fontWeight: '600', color: 'grey' }}>{item.title}</p>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img src={url} className="file-upload" />
          <div class="upload-btn-wrapper">
            <input
              type="file"
              name="myfile"
              accept="image/*"
              id="file"
              hidden
              onChange={(e) => {
                var a = window.URL.createObjectURL(e.target.files[0]);
                this.props.onChange(e.target.files[0], 'file');
                this.setState({ file: a });
              }}
            />
            <label class="custom-label" for="file" style={{ marginRight: 5 }}>
              <AttachmentIcon />
            </label>
          </div>
        </div>
      </>
    );
  }
}
