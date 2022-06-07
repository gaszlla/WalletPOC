package com.reactnativeblockchaincryptompc;

public class CPPBridge {
  static {
    try {
      System.loadLibrary("cpp");
      //   Log.d(TAG, "-------- libcpp-code: loaded");
    } catch (Exception e) {
      //   Log.d(TAG, "-------- libcpp-code: loaded", e);
    }
  }

  public static native long multiply(long a, long b);
}
