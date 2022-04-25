package bit.project.server.dao;

import bit.project.server.entity.Salary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface SalaryDao extends JpaRepository<Salary, Integer>{
    @Query("select new Salary (s.id,s.code,s.employee,s.month,s.epf,s.etf) from Salary s")
    Page<Salary> findAllBasic(PageRequest pageRequest);

    Salary findByCode(String code);
}