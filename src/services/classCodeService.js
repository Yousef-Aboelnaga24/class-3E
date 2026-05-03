import axiosClient from '../api/axiosClient';
import API from '../api/endpoints';

const classCodeService = {
  async getClassCodes() {
    return axiosClient.get(API.CLASS_CODES.LIST);
  },

  async createClassCode(data) {
    return axiosClient.post(API.CLASS_CODES.CREATE, data);
  },

  async deleteClassCode(id) {
    return axiosClient.delete(API.CLASS_CODES.DELETE(id));
  },
};

export default classCodeService;
