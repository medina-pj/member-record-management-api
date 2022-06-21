const mongoose = require('mongoose');

const Schema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    middle_name: { type: String, default: '' },
    suffix: { type: String, default: '' },
    birth_year: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female', ''] },
    contact_number: { type: String, default: '' },
    email_address: { type: String, default: '' },
    address: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      region: { type: String, required: true },
      province: { type: String, required: true },
      city: { type: String, required: true },
      barangay: { type: String, required: true },
    },
    is_coordinator: {
      type: Boolean,
      required: true,
      default: false,
    },
    coordinator_level: {
      type: Number,
      min: 0,
      max: 6,
      default: 0,
      //0-Supporter 1-Barangay 2-City 3-Province 4-Region 5-Admin
    },
    account_info: {
      username: {
        type: String,
        default: null,
      },
      password: {
        type: String,
        default: null,
      },
    },
    isAccountApproved: {
      type: Boolean,
      required: true,
      default: false,
    },
    added_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'supporters',
      default: null,
    },
    deleted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'supporters',
      default: null,
    },
    last_updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'supporters',
      default: null,
    },
    approved_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'supporters',
      default: null,
    },
    photo: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
  },
  {
    collection: 'supporters',
    timestamps: true,
    minimize: false,
  }
);

const Supporter = mongoose.model('supporters', Schema);

module.exports = Supporter;
