package com.openclassrooms.starterjwt.mapper;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class EntityMapperTest {

    static class DummyMapper implements EntityMapper<String, Integer> {

        @Override
        public Integer toEntity(String dto) {
            return dto != null ? Integer.parseInt(dto) : null;
        }

        @Override
        public String toDto(Integer entity) {
            return entity != null ? entity.toString() : null;
        }

        @Override
        public List<Integer> toEntity(List<String> dtoList) {
            return dtoList != null ? dtoList.stream().map(this::toEntity).toList() : null;
        }

        @Override
        public List<String> toDto(List<Integer> entityList) {
            return entityList != null ? entityList.stream().map(this::toDto).toList() : null;
        }
    }

    DummyMapper mapper = new DummyMapper();

    @Test
    void toEntity_shouldConvertStringToInteger() {
        assertEquals(42, mapper.toEntity("42"));
    }

    @Test
    void toDto_shouldConvertIntegerToString() {
        assertEquals("99", mapper.toDto(99));
    }

    @Test
    void toEntityList_shouldConvertStringListToIntegerList() {
        List<Integer> result = mapper.toEntity(List.of("1", "2", "3"));
        assertEquals(List.of(1, 2, 3), result);
    }

    @Test
    void toDtoList_shouldConvertIntegerListToStringList() {
        List<String> result = mapper.toDto(List.of(7, 8, 9));
        assertEquals(List.of("7", "8", "9"), result);
    }
}
