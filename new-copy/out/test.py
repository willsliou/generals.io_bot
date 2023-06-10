def convert_js_map_to_python_dict(js_map_str):
    # Remove the unnecessary strings
    js_map_str = js_map_str.replace("Map(", "").replace(") {", "").replace("}", "").strip()

    # The first line of js_map_str now contains an extraneous size of the map ('39') and the start of the map '{'
    # We need to remove this first line
    js_map_str = js_map_str[js_map_str.index('\n') + 1:]

    # Split the string into pairs of key and value
    pairs_str = js_map_str.split(',')

    # Convert the pairs into a dictionary
    python_dict = {}
    for pair_str in pairs_str:
        pair = pair_str.split(' => ')
        key = int(pair[0].strip())
        value = int(pair[1].strip())
        python_dict[key] = value

    return python_dict

js_map_str = '''
Map(39) {
  198 => 2,
  199 => 3,
  200 => 3,
  201 => 3,
  220 => 2,
  221 => 2,
  224 => 2,
  229 => 3,
  242 => 2,
  247 => 2,
  252 => 52,
  264 => 2,
  265 => 2,
  270 => 3,
  271 => 3,
  275 => 3,
  279 => 2,
  280 => 2,
  281 => 2,
  282 => 2,
  283 => 2,
  284 => 2,
  285 => 2,
  295 => 3,
  296 => 3,
  297 => 3,
  325 => 2,
  348 => 2,
  371 => 2,
  394 => 2,
  395 => 2,
  396 => 2,
  419 => 2,
  441 => 2,
  442 => 2,
  461 => 124,
  462 => 1,
  463 => 2,
  464 => 2
}
'''
python_dict = convert_js_map_to_python_dict(js_map_str)
print(python_dict)
